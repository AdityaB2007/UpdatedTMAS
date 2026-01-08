import { NextRequest } from 'next/server';
import { books, Book } from '@/data/books';
import { parsePdfProblems, ExtractedProblem } from '@/lib/pdf-parser';
import { generateEmbedding } from '@/lib/embeddings';

const LAMBDA_ENDPOINT = 'https://zzveivpchfbyzbewndpizfawhq0jzvid.lambda-url.us-east-1.on.aws/';

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface PracticeProblem {
  bookId: string;
  bookTitle: string;
  problemNumber?: string;
  pageNumber?: string;
  chapter?: string;
  section?: string;
  description: string;
  relevance: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userQuery, bookId, idToken, chatId } = body;

    if (!idToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'User query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!bookId || typeof bookId !== 'string') {
      return new Response(JSON.stringify({ error: 'Book ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find the book
    const book = books.find(b => b.id === bookId);
    if (!book) {
      return new Response(JSON.stringify({ error: 'Book not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if OpenAI API key is configured for vector embeddings
    if (process.env.OPENAI_API_KEY && book.pdfPath) {
      try {
        // Parse PDF and find relevant problems using vector embeddings
        const problems = await findProblemsUsingEmbeddings(userQuery, book);
        
        if (problems.length > 0) {
          return new Response(JSON.stringify({ problems }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // If no problems found via embeddings, fall through to AI-based approach
        console.log('No problems found via embeddings, using AI-based approach');
      } catch (error) {
        console.error('Error finding problems via embeddings:', error);
        // Fall through to AI-based approach
      }
    }

    // Fallback: Use AI to identify relevant practice problems
    // Create a prompt to identify relevant practice problems
    const problemPrompt = `You are an educational assistant helping students find relevant practice problems in textbooks.

Book: "${book.title}"
Book Description: "${book.description}"
User Query: "${userQuery}"

Based on the user's query, recommend 3-5 specific practice problems from this book that would help them practice the concepts they're asking about.

Since I don't have direct access to the book's content, provide recommendations in this format:
- Problem numbers or ranges (e.g., "Problems 15-20", "Chapter 3 Problems", "Section 4.2 Problems")
- Page numbers if you can estimate (e.g., "around pages 45-50")
- Chapter and section references
- Brief description of what each problem covers

Respond with ONLY a valid JSON array in this exact format:
[
  {
    "problemNumber": "15-20",
    "pageNumber": "45-50",
    "chapter": "3",
    "section": "4.2",
    "description": "Problems focusing on net force calculations with multiple forces",
    "relevance": 0.95
  },
  {
    "problemNumber": "25-30",
    "pageNumber": "52-55",
    "chapter": "3",
    "section": "4.3",
    "description": "Problems involving force diagrams and free body diagrams",
    "relevance": 0.90
  }
]

The relevance score should be between 0 and 1, indicating how directly relevant the problem is to the user's query.`;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const messageText = `<p>${escapeHtml(problemPrompt)}</p>`;

    const payload = {
      type: 'CHAT',
      timestamp: timestamp,
      cookie: idToken,
      params: {
        chatId: chatId || generateUUID(),
        text: messageText,
        useSearch: false,
        attachments: [],
        messages: [],
        transcripts: []
      }
    };

    const response = await fetch(LAMBDA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lambda endpoint error:', response.status, errorText.substring(0, 200));
      throw new Error(`Failed to get problem recommendations: ${response.status}`);
    }

    // Check content type to ensure we're getting JSON, not HTML
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const htmlContent = await response.text();
      console.error('Received HTML instead of JSON:', htmlContent.substring(0, 500));
      throw new Error('Received HTML response instead of JSON');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';

    if (reader) {
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Check if we're receiving HTML (error page)
        if (chunk.includes('<!DOCTYPE') || chunk.includes('<html')) {
          console.error('Received HTML in stream, aborting');
          throw new Error('Received HTML response instead of JSON stream');
        }
        
        buffer += chunk;

        let braceDepth = 0;
        let jsonStart = -1;

        for (let i = 0; i < buffer.length; i++) {
          if (buffer[i] === '{') {
            if (braceDepth === 0) jsonStart = i;
            braceDepth++;
          } else if (buffer[i] === '}') {
            braceDepth--;
            if (braceDepth === 0 && jsonStart !== -1) {
              const jsonStr = buffer.substring(jsonStart, i + 1);
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.response?.content) {
                  accumulatedContent += parsed.response.content;
                }
                buffer = buffer.substring(i + 1);
                i = -1;
                jsonStart = -1;
              } catch (parseError) {
                // Continue parsing - might be incomplete JSON
              }
            }
          }
        }
      }
    }

    // Extract problems from response
    const problems = extractProblems(accumulatedContent, book);
    
    return new Response(JSON.stringify({ problems }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Problem recommendation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate problem recommendations',
      problems: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function extractProblems(responseText: string, book: Book): PracticeProblem[] {
  // Check if response is HTML (error page) - this prevents JSON.parse errors
  if (!responseText || responseText.includes('<!DOCTYPE') || responseText.includes('<html') || responseText.trim().startsWith('<')) {
    console.error('Received HTML instead of JSON in extractProblems');
    return generateFallbackProblems(book);
  }
  
  // Try to find JSON array in the response
  let cleanedText = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^```/gm, '')
    .trim();
  
  // Additional check for HTML content after cleaning
  if (cleanedText.includes('<!DOCTYPE') || cleanedText.includes('<html')) {
    console.error('HTML content detected after cleaning');
    return generateFallbackProblems(book);
  }
  
  const jsonArrayMatch = cleanedText.match(/\[[\s\S]*?\]/);
  if (jsonArrayMatch) {
    try {
      // Check if the matched string contains HTML before parsing
      if (jsonArrayMatch[0].includes('<!DOCTYPE') || jsonArrayMatch[0].includes('<html')) {
        console.error('JSON match contains HTML content');
        return generateFallbackProblems(book);
      }
      
      const parsed = JSON.parse(jsonArrayMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter((p: any) => p.description && typeof p.description === 'string')
          .map((p: any) => ({
            bookId: book.id,
            bookTitle: book.title,
            problemNumber: p.problemNumber || undefined,
            pageNumber: p.pageNumber || undefined,
            chapter: p.chapter || undefined,
            section: p.section || undefined,
            description: p.description.trim(),
            relevance: typeof p.relevance === 'number' ? Math.max(0, Math.min(1, p.relevance)) : 0.8
          }))
          .slice(0, 5);
      }
    } catch (e) {
      console.error('Failed to parse problems JSON:', e);
      // If it's a SyntaxError and contains HTML, log it specifically
      if (e instanceof SyntaxError && jsonArrayMatch[0].includes('<')) {
        console.error('JSON parse error due to HTML content in response');
      }
    }
  }

  // Fallback: generate generic recommendations
  return generateFallbackProblems(book);
}

/**
 * Find problems using vector embeddings from parsed PDF
 */
async function findProblemsUsingEmbeddings(
  userQuery: string,
  book: Book
): Promise<PracticeProblem[]> {
  if (!book.pdfPath) {
    return [];
  }

  try {
    // Parse PDF and extract problems with embeddings
    const extractedProblems = await parsePdfProblems(book.pdfPath, book.id);
    
    if (extractedProblems.length === 0) {
      return [];
    }
    
    // Generate embedding for user query
    const queryEmbedding = await generateEmbedding(userQuery);
    
    // Calculate similarity scores for problems that have embeddings
    const problemsWithScores = extractedProblems
      .filter(p => p.embedding) // Only use problems with embeddings
      .map(problem => {
        const similarity = cosineSimilarity(queryEmbedding, problem.embedding!);
        return {
          problem,
          similarity,
        };
      })
      .filter(item => item.similarity > 0.3) // Filter out low similarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5); // Top 5 most relevant
    
    // Convert to PracticeProblem format
    return problemsWithScores.map(({ problem, similarity }) => ({
      bookId: book.id,
      bookTitle: book.title,
      problemNumber: problem.problemNumber,
      pageNumber: problem.pageNumber.toString(),
      chapter: problem.chapter,
      section: problem.section,
      description: problem.text.substring(0, 200).trim() + (problem.text.length > 200 ? '...' : ''),
      relevance: Math.max(0, Math.min(1, similarity)),
    }));
  } catch (error) {
    console.error('Error finding problems using embeddings:', error);
    return [];
  }
}

function generateFallbackProblems(book: Book): PracticeProblem[] {
  // Generate generic problem recommendations based on book type
  const bookLower = book.title.toLowerCase();
  
  if (bookLower.includes('physics')) {
    return [
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '3',
        description: 'Problems on forces and Newton\'s laws',
        relevance: 0.8
      },
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '4',
        description: 'Problems on kinematics and motion',
        relevance: 0.75
      }
    ];
  } else if (bookLower.includes('calculus')) {
    return [
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '2',
        description: 'Problems on derivatives and differentiation',
        relevance: 0.8
      },
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '3',
        description: 'Problems on integrals and integration',
        relevance: 0.75
      }
    ];
  } else if (bookLower.includes('biology')) {
    return [
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '2',
        description: 'Problems on cell structure and function',
        relevance: 0.8
      },
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '3',
        description: 'Problems on genetics and heredity',
        relevance: 0.75
      }
    ];
  } else if (bookLower.includes('chemistry')) {
    return [
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '2',
        description: 'Problems on atomic structure and periodic trends',
        relevance: 0.8
      },
      {
        bookId: book.id,
        bookTitle: book.title,
        chapter: '3',
        description: 'Problems on chemical bonding and reactions',
        relevance: 0.75
      }
    ];
  }
  
  return [
    {
      bookId: book.id,
      bookTitle: book.title,
      description: 'Practice problems throughout the book',
      relevance: 0.7
    }
  ];
}

