import { books, Book } from '@/data/books';

// Vector embedding interface
export interface BookEmbedding {
  book: Book;
  embedding: number[];
}

// Cache for book embeddings (in-memory)
let bookEmbeddingsCache: BookEmbedding[] | null = null;

/**
 * Generate embedding for a text using OpenAI API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small', // Using smaller, cheaper model
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Create a searchable text representation of a book
 */
function createBookText(book: Book): string {
  const authors = book.authors ? book.authors.join(', ') : book.author;
  return `${book.title} by ${authors}. ${book.description}. ${book.pageCount} pages, ${book.problemCount} problems.`;
}

/**
 * Generate embeddings for all books and cache them
 */
export async function generateBookEmbeddings(): Promise<BookEmbedding[]> {
  // Return cached embeddings if available
  if (bookEmbeddingsCache) {
    return bookEmbeddingsCache;
  }

  console.log('Generating embeddings for books...');
  const embeddings: BookEmbedding[] = [];

  // Generate embeddings for each book
  for (const book of books) {
    try {
      const bookText = createBookText(book);
      const embedding = await generateEmbedding(bookText);
      embeddings.push({ book, embedding });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error generating embedding for ${book.title}:`, error);
      // Continue with other books even if one fails
    }
  }

  bookEmbeddingsCache = embeddings;
  console.log(`Generated embeddings for ${embeddings.length} books`);
  return embeddings;
}

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

/**
 * Find most similar books using vector similarity search
 */
export async function findSimilarBooks(
  query: string,
  topK: number = 5
): Promise<Book[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Get book embeddings (will use cache if available)
    const bookEmbeddings = await generateBookEmbeddings();
    
    // Calculate similarity scores
    const similarities = bookEmbeddings.map(({ book, embedding }) => ({
      book,
      similarity: cosineSimilarity(queryEmbedding, embedding),
    }));
    
    // Sort by similarity (highest first) and return top K
    const topBooks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(item => item.book);
    
    return topBooks;
  } catch (error) {
    console.error('Error in vector similarity search:', error);
    throw error;
  }
}

/**
 * Clear the embeddings cache (useful for testing or refreshing)
 */
export function clearEmbeddingsCache(): void {
  bookEmbeddingsCache = null;
}

