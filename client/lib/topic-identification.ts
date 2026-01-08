import { generateEmbedding } from './embeddings';

// Define major academic subjects/topics
export interface TopicRelevance {
  topic: string;
  relevance: number; // 0-1 score
  description: string;
}

const TOPICS = [
  {
    name: 'Physics',
    description: 'Physics concepts including mechanics, kinematics, dynamics, forces, energy, momentum, waves, electricity, magnetism, thermodynamics',
    keywords: ['physics', 'force', 'acceleration', 'velocity', 'momentum', 'energy', 'kinematics', 'dynamics', 'newton', 'mechanics', 'electricity', 'magnetism', 'thermodynamics', 'wave', 'quantum']
  },
  {
    name: 'Calculus',
    description: 'Calculus topics including derivatives, integrals, limits, differentiation, integration, series, parametric equations, polar coordinates',
    keywords: ['calculus', 'derivative', 'integral', 'limit', 'differentiation', 'integration', 'series', 'parametric', 'polar', 'differential', 'antiderivative']
  },
  {
    name: 'Chemistry',
    description: 'Chemistry concepts including atoms, molecules, reactions, compounds, elements, stoichiometry, thermodynamics, kinetics, equilibrium',
    keywords: ['chemistry', 'molecule', 'atom', 'reaction', 'compound', 'element', 'stoichiometry', 'thermodynamics', 'kinetics', 'equilibrium', 'organic', 'inorganic']
  },
  {
    name: 'Biology',
    description: 'Biology topics including cells, genetics, evolution, ecology, anatomy, physiology, biochemistry, molecular biology',
    keywords: ['biology', 'cell', 'genetics', 'evolution', 'ecology', 'anatomy', 'physiology', 'biochemistry', 'molecular', 'dna', 'rna', 'protein']
  },
  {
    name: 'Statistics',
    description: 'Statistics and probability including data analysis, distributions, hypothesis testing, regression, probability, sampling',
    keywords: ['statistics', 'probability', 'distribution', 'hypothesis', 'regression', 'sampling', 'data analysis', 'mean', 'median', 'standard deviation', 'variance']
  },
  {
    name: 'Computer Science',
    description: 'Computer science topics including programming, algorithms, data structures, software development, computer systems',
    keywords: ['computer science', 'programming', 'algorithm', 'data structure', 'software', 'code', 'programming language', 'computing', 'csp']
  },
  {
    name: 'Mathematics',
    description: 'General mathematics including algebra, geometry, trigonometry, number theory, competition math, problem solving',
    keywords: ['math', 'mathematics', 'algebra', 'geometry', 'trigonometry', 'amc', 'competition', 'problem solving', 'number theory']
  },
  {
    name: 'Psychology',
    description: 'Psychology topics including cognitive psychology, behavioral psychology, social psychology, developmental psychology',
    keywords: ['psychology', 'cognitive', 'behavioral', 'social psychology', 'developmental', 'mental', 'brain', 'neuroscience']
  },
  {
    name: 'Geography',
    description: 'Human geography including population, migration, culture, political geography, economic geography, urban geography',
    keywords: ['geography', 'population', 'migration', 'culture', 'political', 'economic', 'urban', 'human geography']
  }
];

// Cache for topic embeddings
let topicEmbeddingsCache: Map<string, number[]> | null = null;

/**
 * Generate embeddings for all topics and cache them
 */
async function generateTopicEmbeddings(): Promise<Map<string, number[]>> {
  if (topicEmbeddingsCache) {
    return topicEmbeddingsCache;
  }

  const embeddings = new Map<string, number[]>();
  
  for (const topic of TOPICS) {
    try {
      const topicText = `${topic.name}: ${topic.description}`;
      const embedding = await generateEmbedding(topicText);
      embeddings.set(topic.name, embedding);
    } catch (error) {
      console.error(`Error generating embedding for topic ${topic.name}:`, error);
    }
  }

  topicEmbeddingsCache = embeddings;
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
 * Identify the most relevant topics for a query using vector embeddings
 */
export async function identifyTopics(query: string): Promise<TopicRelevance[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Get topic embeddings
    const topicEmbeddings = await generateTopicEmbeddings();
    
    // Calculate relevance scores
    const relevances: TopicRelevance[] = [];
    
    for (const topic of TOPICS) {
      const topicEmbedding = topicEmbeddings.get(topic.name);
      if (topicEmbedding) {
        const similarity = cosineSimilarity(queryEmbedding, topicEmbedding);
        relevances.push({
          topic: topic.name,
          relevance: Math.max(0, similarity), // Ensure non-negative
          description: topic.description
        });
      }
    }
    
    // Sort by relevance (highest first) and normalize scores
    relevances.sort((a, b) => b.relevance - a.relevance);
    
    // Normalize to 0-1 range where top score is 1.0
    if (relevances.length > 0 && relevances[0].relevance > 0) {
      const maxRelevance = relevances[0].relevance;
      relevances.forEach(rel => {
        rel.relevance = rel.relevance / maxRelevance;
      });
    }
    
    // Filter out topics with very low relevance (< 0.1)
    const filteredRelevances = relevances.filter(rel => rel.relevance >= 0.1);
    
    // If the top topic has 100% relevance (or very close to it, >= 0.99), only return that topic
    if (filteredRelevances.length > 0 && filteredRelevances[0].relevance >= 0.99) {
      return [filteredRelevances[0]];
    }
    
    // Otherwise, return top 5
    return filteredRelevances.slice(0, 5);
      
  } catch (error) {
    console.error('Error identifying topics:', error);
    // Fallback to keyword-based identification
    return identifyTopicsByKeywords(query);
  }
}

/**
 * Fallback topic identification using keyword matching
 */
function identifyTopicsByKeywords(query: string): TopicRelevance[] {
  const queryLower = query.toLowerCase();
  const relevances: TopicRelevance[] = [];
  
  for (const topic of TOPICS) {
    let matchCount = 0;
    for (const keyword of topic.keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      // Calculate relevance based on number of keyword matches
      const relevance = Math.min(1.0, matchCount / topic.keywords.length * 2);
      relevances.push({
        topic: topic.name,
        relevance,
        description: topic.description
      });
    }
  }
  
  // Sort by relevance and normalize
  relevances.sort((a, b) => b.relevance - a.relevance);
  
  if (relevances.length > 0 && relevances[0].relevance > 0) {
    const maxRelevance = relevances[0].relevance;
    relevances.forEach(rel => {
      rel.relevance = Math.min(1.0, rel.relevance / maxRelevance);
    });
  }
  
  return relevances.slice(0, 5);
}

/**
 * Clear the topic embeddings cache
 */
export function clearTopicEmbeddingsCache(): void {
  topicEmbeddingsCache = null;
}

