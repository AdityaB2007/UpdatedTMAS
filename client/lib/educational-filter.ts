import { generateEmbedding } from './embeddings';

// Cache for educational content embedding
let educationalContentEmbeddingCache: number[] | null = null;

/**
 * Generate embedding for educational content description
 */
async function getEducationalContentEmbedding(): Promise<number[]> {
  if (educationalContentEmbeddingCache) {
    return educationalContentEmbeddingCache;
  }

  const educationalText = `Educational content about mathematics, science, physics, chemistry, biology, calculus, statistics, computer science, psychology, geography, competition math, AP courses, study strategies, academic learning, problem solving, formulas, concepts, theories, exam preparation, homework help, tutoring, algebra, geometry, trigonometry, kinematics, dynamics, genetics, evolution, programming, algorithms, data analysis, hypothesis testing, cognitive psychology, human geography, population studies`;
  
  try {
    const embedding = await generateEmbedding(educationalText);
    educationalContentEmbeddingCache = embedding;
    return embedding;
  } catch (error) {
    console.error('Error generating educational content embedding:', error);
    throw error;
  }
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
 * Check if a query is educational using vector embeddings
 * Returns true if the query is educational, false otherwise
 */
export async function isEducationalQuery(query: string): Promise<boolean> {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to keyword-based check if embeddings not available
      return isEducationalByKeywords(query);
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Get educational content embedding
    const educationalEmbedding = await getEducationalContentEmbedding();
    
    // Calculate similarity
    const similarity = cosineSimilarity(queryEmbedding, educationalEmbedding);
    
    // Threshold: if similarity is above 0.25, consider it educational
    // Lowered threshold to be more permissive for educational queries
    // Also check keyword fallback as a secondary check
    const keywordCheck = isEducationalByKeywords(query);
    
    // If either embedding similarity OR keyword check passes, allow it
    return similarity >= 0.25 || keywordCheck;
    
  } catch (error) {
    console.error('Error checking if query is educational:', error);
    // Fallback to keyword-based check
    return isEducationalByKeywords(query);
  }
}

/**
 * Fallback keyword-based educational content detection
 */
function isEducationalByKeywords(query: string): boolean {
  const queryLower = query.toLowerCase();
  
  // Educational keywords - comprehensive list covering all subjects
  const educationalKeywords = [
    // Math subjects
    'math', 'mathematics', 'calculus', 'algebra', 'geometry', 'trigonometry',
    'precalculus', 'arithmetic', 'number theory', 'discrete math',
    // Competition math
    'amc', 'competition math', 'olympiad', 'math contest', 'problem solving',
    // Calculus concepts
    'derivative', 'integral', 'limit', 'differentiation', 'integration',
    'antiderivative', 'differential', 'series', 'sequence', 'convergence',
    'parametric', 'polar coordinates', 'vector calculus', 'multivariable',
    // Algebra concepts
    'polynomial', 'quadratic', 'linear', 'exponential', 'logarithm',
    'inequality', 'system of equations', 'matrix', 'determinant',
    // Geometry concepts
    'triangle', 'circle', 'angle', 'perimeter', 'area', 'volume',
    'surface area', 'theorem', 'proof', 'congruent', 'similar',
    // Science subjects
    'physics', 'chemistry', 'biology', 'science', 'stem',
    // Physics concepts
    'force', 'energy', 'velocity', 'acceleration', 'momentum', 'kinematics',
    'dynamics', 'net force', 'newton', 'motion', 'displacement', 'speed',
    'mass', 'weight', 'gravity', 'friction', 'tension', 'normal force',
    'work', 'power', 'torque', 'rotation', 'angular', 'oscillation',
    'wave', 'frequency', 'wavelength', 'amplitude', 'electricity',
    'magnetism', 'electric field', 'magnetic field', 'current', 'voltage',
    'resistance', 'circuit', 'thermodynamics', 'entropy', 'heat',
    'temperature', 'pressure', 'gas law', 'quantum', 'photon',
    // Chemistry concepts
    'molecule', 'atom', 'reaction', 'compound', 'element', 'bond',
    'ionic', 'covalent', 'molecular', 'stoichiometry', 'mole',
    'molarity', 'concentration', 'ph', 'acid', 'base', 'buffer',
    'equilibrium', 'kinetics', 'thermodynamics', 'enthalpy', 'entropy',
    'gibbs', 'oxidation', 'reduction', 'redox', 'organic', 'inorganic',
    'periodic table', 'electron', 'proton', 'neutron', 'ion', 'isotope',
    // Biology concepts
    'cell', 'genetics', 'evolution', 'ecology', 'anatomy', 'physiology',
    'biochemistry', 'molecular biology', 'dna', 'rna', 'protein',
    'enzyme', 'metabolism', 'photosynthesis', 'respiration', 'mitosis',
    'meiosis', 'chromosome', 'gene', 'allele', 'mutation', 'natural selection',
    'ecosystem', 'biome', 'population', 'community', 'organism', 'tissue',
    'organ', 'system', 'homeostasis', 'hormone', 'neuron', 'synapse',
    // Statistics concepts
    'statistics', 'probability', 'distribution', 'normal distribution',
    'binomial', 'hypothesis', 'hypothesis testing', 'regression', 'correlation',
    'sampling', 'sample', 'population', 'mean', 'median', 'mode',
    'standard deviation', 'variance', 'z-score', 't-test', 'chi-square',
    'confidence interval', 'p-value', 'statistical significance', 'data analysis',
    // Computer Science concepts
    'computer science', 'programming', 'algorithm', 'data structure',
    'software', 'code', 'programming language', 'computing', 'csp',
    'variable', 'function', 'loop', 'array', 'list', 'string', 'integer',
    'boolean', 'conditional', 'recursion', 'sorting', 'searching',
    'binary', 'hexadecimal', 'bit', 'byte', 'memory', 'cpu',
    // Psychology concepts
    'psychology', 'cognitive', 'behavioral', 'social psychology',
    'developmental', 'mental', 'brain', 'neuroscience', 'neuron',
    'synapse', 'neurotransmitter', 'memory', 'learning', 'perception',
    'sensation', 'consciousness', 'emotion', 'personality', 'intelligence',
    'motivation', 'stress', 'anxiety', 'depression', 'therapy', 'treatment',
    // Geography concepts
    'geography', 'human geography', 'population', 'migration', 'culture',
    'political geography', 'economic geography', 'urban geography',
    'demography', 'demographic', 'urbanization', 'rural', 'urban',
    'sustainability', 'environment', 'climate', 'region', 'location',
    'place', 'space', 'scale', 'globalization', 'development',
    // Problem solving and learning
    'problem', 'solve', 'equation', 'formula', 'concept', 'theory',
    'principle', 'law', 'rule', 'method', 'technique', 'strategy',
    // Learning context
    'study', 'learn', 'homework', 'assignment', 'exam', 'test', 'quiz',
    'ap', 'course', 'class', 'lesson', 'tutorial', 'explain', 'understand',
    'review', 'practice', 'exercise', 'worksheet', 'textbook', 'guide',
    // Question words (typically educational)
    'what is', 'what are', 'what does', 'why', 'how', 'how does', 'how to',
    'when', 'where', 'which', 'who', 'explain', 'describe', 'define',
    'compare', 'contrast', 'analyze', 'evaluate', 'interpret', 'summarize',
    // Action words
    'calculate', 'find', 'determine', 'solve', 'compute', 'evaluate',
    'analyze', 'derive', 'prove', 'show', 'demonstrate', 'illustrate',
    'identify', 'classify', 'categorize', 'predict', 'estimate', 'approximate'
  ];
  
  // Non-educational keywords (sports, food, entertainment, etc.)
  const nonEducationalKeywords = [
    'pizza', 'restaurant', 'food', 'eat', 'order', 'delivery',
    'sports', 'football', 'basketball', 'baseball', 'soccer', 'game', 'score',
    '49ers', 'giants', 'team', 'player', 'match', 'playoff',
    'movie', 'show', 'tv', 'entertainment', 'celebrity', 'actor',
    'weather', 'forecast', 'temperature', 'rain', 'snow',
    'shopping', 'buy', 'purchase', 'store', 'mall',
    'travel', 'vacation', 'hotel', 'flight', 'trip',
    'news', 'politics', 'election', 'president', 'government'
  ];
  
  // Check for educational keywords first (more permissive)
  for (const keyword of educationalKeywords) {
    if (queryLower.includes(keyword)) {
      return true;
    }
  }
  
  // Check for question patterns (what, how, why, etc.) - these are typically educational
  const questionPatterns = [
    /^what\s+(is|are|does|do|was|were)/i,
    /^how\s+(does|do|is|are|can|will)/i,
    /^why\s+(does|do|is|are|can|will)/i,
    /^explain\s+/i,
    /^describe\s+/i,
    /^define\s+/i,
    /^calculate\s+/i,
    /^find\s+/i,
    /^determine\s+/i,
    /^solve\s+/i
  ];
  
  for (const pattern of questionPatterns) {
    if (pattern.test(query)) {
      return true;
    }
  }
  
  // Check for non-educational keywords (but with lower priority)
  for (const keyword of nonEducationalKeywords) {
    if (queryLower.includes(keyword)) {
      // But allow if it's clearly educational context (e.g., "physics of football")
      if (!queryLower.match(/\b(physics|math|science|calculate|formula|problem|force|energy|velocity|acceleration|equation|concept|theory)\b/)) {
        return false;
      }
    }
  }
  
  // If query is very short (< 3 words) and doesn't match educational keywords, likely not educational
  const wordCount = query.trim().split(/\s+/).length;
  if (wordCount < 3) {
    return false;
  }
  
  // Default: if we can't determine and query is reasonably long, allow it (let the AI decide)
  // Be more permissive for longer queries as they're more likely to be educational questions
  return wordCount >= 5;
}

/**
 * Clear the educational content embedding cache
 */
export function clearEducationalContentCache(): void {
  educationalContentEmbeddingCache = null;
}

