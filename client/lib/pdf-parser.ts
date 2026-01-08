import { generateEmbedding } from './embeddings';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export interface ExtractedProblem {
  text: string;
  pageNumber: number;
  problemNumber?: string;
  chapter?: string;
  section?: string;
  embedding?: number[];
}

// Cache for parsed problems
const problemCache: Map<string, ExtractedProblem[]> = new Map();

/**
 * Extract text from a PDF file using pdf-parse (Node.js-compatible)
 */
async function extractTextFromPdf(pdfPath: string): Promise<string[]> {
  try {
    // Read PDF file from public directory
    const fullPath = path.join(process.cwd(), 'public', pdfPath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`PDF file not found: ${fullPath}`);
      return [];
    }

    const dataBuffer = fs.readFileSync(fullPath);
    
    // Parse PDF and extract text
    const pdfData = await pdfParse(dataBuffer);
    
    // pdf-parse extracts all text at once, but we can try to split by pages
    // Note: pdf-parse doesn't provide perfect page boundaries, but we can approximate
    // by splitting on common page break indicators or using the text property
    
    // Get the full text
    const fullText = pdfData.text;
    
    // Try to split by page breaks or approximate page boundaries
    // Many PDFs have page numbers or other indicators we can use
    // For now, we'll split the text into chunks based on estimated page length
    const estimatedCharsPerPage = Math.max(2000, Math.floor(fullText.length / Math.max(1, pdfData.numpages)));
    const pages: string[] = [];
    
    // Split text into approximate pages
    for (let i = 0; i < pdfData.numpages; i++) {
      const start = i * estimatedCharsPerPage;
      const end = Math.min((i + 1) * estimatedCharsPerPage, fullText.length);
      const pageText = fullText.substring(start, end).trim();
      
      if (pageText.length > 0) {
        pages.push(pageText);
      }
    }
    
    // If we couldn't split properly, return the full text as a single page
    if (pages.length === 0 && fullText.length > 0) {
      pages.push(fullText);
    }
    
    console.log(`Extracted text from ${pdfPath}: ${pages.length} pages, ${fullText.length} characters`);
    
    return pages;
  } catch (error) {
    console.error(`Error extracting text from PDF ${pdfPath}:`, error);
    return [];
  }
}

/**
 * Identify practice problems in text using pattern matching
 */
function identifyProblems(pages: string[], bookTitle: string): ExtractedProblem[] {
  const problems: ExtractedProblem[] = [];
  
  // Patterns to identify problems - more comprehensive
  const problemPatterns = [
    // Standard problem formats
    /(?:Problem|Exercise|Question|Practice Problem)\s+(\d+)[\.\)\s]/gi,
    /(?:Problem|Exercise|Question)\s+(\d+)\s*[-–—]/gi,
    // Numbered problems at start of line
    /^\s*(\d+)[\.\)]\s+(?=[A-Z])/gm,
    // Chapter/Section references
    /Chapter\s+(\d+)[\s,]+(?:Problem|Exercise|Question)\s+(\d+)/gi,
    /Section\s+([\d.]+)[\s,]+(?:Problem|Exercise|Question)\s+(\d+)/gi,
    // Problem sets
    /(?:Problems|Exercises|Questions)\s+(\d+)[-–—](\d+)/gi,
    // AP-style problem references
    /AP\s+(?:Problem|Exercise)\s+(\d+)/gi,
  ];
  
  const seenProblems = new Set<string>(); // Track seen problems to avoid duplicates
  
  pages.forEach((pageText, pageIndex) => {
    const pageNumber = pageIndex + 1;
    
    // Try to find problems on this page
    for (const pattern of problemPatterns) {
      const matches = [...pageText.matchAll(pattern)];
      
      for (const match of matches) {
        // Extract context around the problem (next 300-600 characters for better context)
        const matchIndex = match.index || 0;
        const contextStart = Math.max(0, matchIndex);
        const contextEnd = Math.min(pageText.length, matchIndex + 600);
        let problemText = pageText.substring(contextStart, contextEnd);
        
        // Extract problem number
        let problemNumber: string | undefined;
        let chapter: string | undefined;
        let section: string | undefined;
        
        if (match[2]) {
          // Chapter/Section format
          chapter = match[1];
          problemNumber = match[2];
        } else if (match[1]) {
          problemNumber = match[1];
        }
        
        // Try to extract chapter/section from surrounding text (look back further)
        const lookbackStart = Math.max(0, matchIndex - 200);
        const lookbackText = pageText.substring(lookbackStart, matchIndex);
        
        if (!chapter) {
          const chapterMatch = lookbackText.match(/Chapter\s+(\d+)/i);
          if (chapterMatch) chapter = chapterMatch[1];
        }
        
        if (!section) {
          const sectionMatch = lookbackText.match(/Section\s+([\d.]+)/i);
          if (sectionMatch) section = sectionMatch[1];
        }
        
        // Clean up problem text - remove excessive whitespace
        problemText = problemText.replace(/\s+/g, ' ').trim();
        
        // Create unique key for deduplication
        const uniqueKey = `${pageNumber}-${problemNumber || matchIndex}`;
        
        // Only add if we have meaningful content and haven't seen this problem before
        if (problemText.length > 50 && !seenProblems.has(uniqueKey)) {
          seenProblems.add(uniqueKey);
          problems.push({
            text: problemText,
            pageNumber,
            problemNumber,
            chapter,
            section,
          });
        }
      }
    }
    
    // Also look for problem sets (e.g., "Problems 1-10")
    const problemSetPattern = /(?:Problems|Exercises)\s+(\d+)[-–—](\d+)/gi;
    const setMatches = [...pageText.matchAll(problemSetPattern)];
    
    for (const match of setMatches) {
      const startNum = parseInt(match[1]);
      const endNum = parseInt(match[2]);
      const contextStart = Math.max(0, (match.index || 0) - 50);
      const contextEnd = Math.min(pageText.length, (match.index || 0) + 200);
      const problemText = pageText.substring(contextStart, contextEnd);
      
      problems.push({
        text: problemText.trim(),
        pageNumber,
        problemNumber: `${startNum}-${endNum}`,
      });
    }
  });
  
  // Sort by page number and problem number for better organization
  problems.sort((a, b) => {
    if (a.pageNumber !== b.pageNumber) {
      return a.pageNumber - b.pageNumber;
    }
    if (a.problemNumber && b.problemNumber) {
      const aNum = parseInt(a.problemNumber.split('-')[0]);
      const bNum = parseInt(b.problemNumber.split('-')[0]);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
    }
    return 0;
  });
  
  return problems;
}

/**
 * Parse PDF and extract practice problems with embeddings
 */
export async function parsePdfProblems(
  pdfPath: string,
  bookId: string
): Promise<ExtractedProblem[]> {
  // Check cache first
  const cacheKey = `${bookId}-${pdfPath}`;
  if (problemCache.has(cacheKey)) {
    return problemCache.get(cacheKey)!;
  }
  
  try {
    console.log(`Parsing PDF: ${pdfPath}`);
    
    // Extract text from PDF
    const pages = await extractTextFromPdf(pdfPath);
    
    if (pages.length === 0) {
      console.warn(`No text extracted from PDF: ${pdfPath}`);
      return [];
    }
    
    // Identify problems
    const problems = identifyProblems(pages, bookId);
    
    if (problems.length === 0) {
      console.warn(`No problems identified in PDF: ${pdfPath}`);
      return [];
    }
    
    console.log(`Found ${problems.length} potential problems in ${pdfPath}`);
    
    // Generate embeddings for each problem (limit to avoid rate limits)
    const problemsWithEmbeddings: ExtractedProblem[] = [];
    const maxProblems = Math.min(problems.length, 100); // Limit to 100 problems per book
    
    for (let i = 0; i < maxProblems; i++) {
      const problem = problems[i];
      try {
        // Create a searchable text representation
        const problemText = `${problem.problemNumber ? `Problem ${problem.problemNumber}` : 'Problem'} on page ${problem.pageNumber}. ${problem.text.substring(0, 300)}`;
        const embedding = await generateEmbedding(problemText);
        
        problemsWithEmbeddings.push({
          ...problem,
          embedding,
        });
        
        // Small delay to avoid rate limiting
        if (i < maxProblems - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error(`Error generating embedding for problem ${i}:`, error);
        // Continue without embedding
        problemsWithEmbeddings.push(problem);
      }
    }
    
    // Cache the results
    problemCache.set(cacheKey, problemsWithEmbeddings);
    
    return problemsWithEmbeddings;
  } catch (error) {
    console.error(`Error parsing PDF ${pdfPath}:`, error);
    return [];
  }
}

/**
 * Clear the problem cache
 */
export function clearProblemCache(): void {
  problemCache.clear();
}

