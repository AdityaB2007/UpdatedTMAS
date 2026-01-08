import { NextRequest } from 'next/server';
import { findSimilarBooks } from '@/lib/embeddings';
import { identifyTopics, TopicRelevance } from '@/lib/topic-identification';
import { books, Book } from '@/data/books';

/**
 * Map topics to relevant book IDs
 */
const TOPIC_TO_BOOK_IDS: Record<string, string[]> = {
  'Biology': ['ace-ap-biology'],
  'Physics': ['ace-ap-physics-1', 'ace-ap-physics-c'],
  'Calculus': ['ace-ap-calculus-ab', 'ace-ap-calculus-bc'],
  'Chemistry': ['ace-ap-chemistry'],
  'Statistics': ['ace-ap-statistics'],
  'Computer Science': ['ace-ap-csp'],
  'Psychology': ['ace-ap-psychology'],
  'Geography': ['ace-ap-human-geography'],
  'Mathematics': ['ace-amc-10-12', 'amc-10-12-key'],
};

/**
 * Filter books by topic if a 100% topic is identified
 */
function filterBooksByTopic(books: Book[], topics: TopicRelevance[]): Book[] {
  // Check if there's a 100% topic (relevance >= 0.99)
  if (topics.length === 1 && topics[0].relevance >= 0.99) {
    const topicName = topics[0].topic;
    const relevantBookIds = TOPIC_TO_BOOK_IDS[topicName] || [];
    
    if (relevantBookIds.length > 0) {
      // Filter books to only include those matching the topic
      const filteredBooks = books.filter(book => relevantBookIds.includes(book.id));
      
      // If we found matching books, return only those
      if (filteredBooks.length > 0) {
        return filteredBooks;
      }
    }
  }
  
  // If no 100% topic or no matching books found, return all books
  return books;
}

export async function POST(request: NextRequest) {
  let userQuery = '';
  
  try {
    const body = await request.json();
    userQuery = body.userQuery || '';
    const { conversationHistory, idToken, chatId } = body;

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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set, falling back to keyword matching');
      return fallbackRecommendations(userQuery);
    }

    try {
      // Build a comprehensive query from user query and recent conversation context
      let searchQuery = userQuery.trim();
      
      // Add context from recent conversation if available
      if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        const recentMessages = conversationHistory.slice(-3); // Last 3 messages for context
        const contextText = recentMessages
          .map((msg: { role: string; content: string }) => msg.content)
          .join(' ');
        searchQuery = `${searchQuery} ${contextText}`.trim();
      }

      // Identify relevant topics first
      const topics = await identifyTopics(searchQuery);
      
      // Use vector similarity search to find relevant books
      let recommendedBooks = await findSimilarBooks(searchQuery, 5);
      
      // If a 100% topic is identified, filter books to only show those related to that topic
      if (topics.length === 1 && topics[0].relevance >= 0.99) {
        recommendedBooks = filterBooksByTopic(recommendedBooks, topics);
        
        // If filtering resulted in no books, fall back to topic-based matching
        if (recommendedBooks.length === 0) {
          const topicName = topics[0].topic;
          const relevantBookIds = TOPIC_TO_BOOK_IDS[topicName] || [];
          recommendedBooks = books.filter(book => relevantBookIds.includes(book.id));
        }
      }
      
      // Ensure we return at least some books
      if (recommendedBooks.length === 0) {
        return fallbackRecommendations(userQuery);
      }
      
      return new Response(JSON.stringify({ 
        books: recommendedBooks,
        topics: topics
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Vector embedding search error:', error);
      // Fallback to keyword matching if vector search fails
      return fallbackRecommendations(userQuery);
    }

  } catch (error) {
    console.error('Book recommendation error:', error);
    // Fallback to keyword matching - use userQuery if available, otherwise empty string
    return fallbackRecommendations(userQuery || '');
  }
}

/**
 * Fallback recommendation function using keyword matching
 * Used when OpenAI API is not available or fails
 */
function fallbackRecommendations(query: string): Response {
  const queryLower = query.toLowerCase();
  const keywords: { [key: string]: string[] } = {
    'calculus': ['ACE AP Calculus AB', 'ACE AP Calculus BC'],
    'physics': ['ACE AP Physics 1', 'ACE AP Physics C: Mechanics'],
    'chemistry': ['ACE AP Chemistry'],
    'biology': ['ACE AP Biology'],
    'statistics': ['ACE AP Statistics Review Book'],
    'computer science': ['ACE AP Computer Science Principles'],
    'csp': ['ACE AP Computer Science Principles'],
    'amc': ['ACE The AMC 10/12', 'AMC 10/12 Key Fundamentals and Strategies'],
    'psychology': ['ACE AP Psychology'],
    'geography': ['ACE AP Human Geography'],
  };

  const matchedBooks: Book[] = [];
  const matchedIds = new Set<string>();

  // Check for keyword matches
  for (const [keyword, titles] of Object.entries(keywords)) {
    if (queryLower.includes(keyword)) {
      titles.forEach(title => {
        const book = books.find(b => b.title === title);
        if (book && !matchedIds.has(book.id)) {
          matchedBooks.push(book);
          matchedIds.add(book.id);
        }
      });
    }
  }

  // If no matches, return top 3 books
  const resultBooks = matchedBooks.length > 0 ? matchedBooks.slice(0, 5) : books.slice(0, 3);
  
  return new Response(JSON.stringify({ books: resultBooks }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
