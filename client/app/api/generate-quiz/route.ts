import { NextRequest } from 'next/server';

const LAMBDA_ENDPOINT = 'https://zzveivpchfbyzbewndpizfawhq0jzvid.lambda-url.us-east-1.on.aws/';

interface QuizQuestion {
  question: string;
  choices: string[];
  correctAnswer: number; // 0-3 index
  hint: string;
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aiResponse, idToken, chatId } = body;

    if (!idToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clean the AI response to remove markdown and HTML tags for better context
    const cleanResponse = aiResponse
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
      .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^\*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove code
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim()
      .substring(0, 2000); // Limit length

    // Create a prompt to generate quiz questions
    const quizPrompt = `You are an educational quiz generator. Based on the following educational content about math and science, generate exactly 3 multiple-choice quiz questions that test specific concepts, formulas, principles, or problem-solving skills mentioned in the content.

IMPORTANT REQUIREMENTS:
1. Questions MUST be directly related to the specific technical content (formulas, concepts, principles, calculations)
2. Questions should test understanding of the actual subject matter (physics, math, chemistry, etc.), NOT general learning strategies
3. Each question must have exactly 4 answer choices
4. Include specific numbers, formulas, or concepts from the content when relevant
5. Make questions progressively more challenging if possible

Content: "${cleanResponse}"

Respond with ONLY a valid JSON array in this exact format (no markdown, no code blocks, just pure JSON):
[
  {
    "question": "Specific question about the content?",
    "choices": ["Specific option A", "Specific option B", "Specific option C", "Specific option D"],
    "correctAnswer": 0,
    "hint": "Specific hint related to the concept"
  },
  {
    "question": "Another specific question about the content?",
    "choices": ["Specific option A", "Specific option B", "Specific option C", "Specific option D"],
    "correctAnswer": 1,
    "hint": "Specific hint related to the concept"
  },
  {
    "question": "Third specific question about the content?",
    "choices": ["Specific option A", "Specific option B", "Specific option C", "Specific option D"],
    "correctAnswer": 2,
    "hint": "Specific hint related to the concept"
  }
]

The correctAnswer should be the index (0-3) of the correct choice. Focus on testing actual knowledge of the subject matter discussed.`;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const messageText = `<p>${escapeHtml(quizPrompt)}</p>`;

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
      throw new Error('Failed to generate quiz');
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
              } catch {
                // Continue parsing
              }
            }
          }
        }
      }
    }

    // Extract JSON array from response
    const quizQuestions = extractQuizQuestions(accumulatedContent, aiResponse);
    
    return new Response(JSON.stringify({ questions: quizQuestions }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate quiz',
      questions: generateFallbackQuiz()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function extractQuizQuestions(responseText: string, originalContent: string): QuizQuestion[] {
  // Remove markdown code blocks if present
  let cleanedText = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^```/gm, '')
    .trim();
  
  // Try multiple strategies to extract JSON array
  let jsonArray: any[] | null = null;
  
  // Strategy 1: Look for JSON array directly
  const jsonArrayMatch = cleanedText.match(/\[[\s\S]*?\]/);
  if (jsonArrayMatch) {
    try {
      const parsed = JSON.parse(jsonArrayMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        jsonArray = parsed;
      }
    } catch (e) {
      // Try next strategy
    }
  }
  
  // Strategy 2: Look for JSON object with questions array
  if (!jsonArray) {
    const jsonObjectMatch = cleanedText.match(/\{[\s\S]*?\}/);
    if (jsonObjectMatch) {
      try {
        const parsed = JSON.parse(jsonObjectMatch[0]);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          jsonArray = parsed.questions;
        } else if (Array.isArray(parsed)) {
          jsonArray = parsed;
        }
      } catch (e) {
        // Try next strategy
      }
    }
  }
  
  // Strategy 3: Try parsing the entire cleaned text
  if (!jsonArray) {
    try {
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed)) {
        jsonArray = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        jsonArray = parsed.questions;
      }
    } catch (e) {
      // Continue to fallback
    }
  }
  
  // Strategy 4: Try to extract from markdown list or other formats
  if (!jsonArray) {
    // Look for patterns like "Question 1:", "1.", etc. and try to reconstruct
    const questionMatches = cleanedText.match(/(?:Question\s*\d+|^\d+\.)\s*([^\n]+)/gmi);
    if (questionMatches && questionMatches.length >= 3) {
      // This is a fallback - we'll return null and use the fallback quiz
      console.log('Found questions but couldn\'t parse as JSON, using fallback');
    }
  }
  
  if (jsonArray && Array.isArray(jsonArray) && jsonArray.length > 0) {
    // Validate and clean the questions
    const validQuestions = jsonArray
      .filter((q: any) => 
        q && 
        typeof q === 'object' &&
        q.question && 
        typeof q.question === 'string' &&
        q.question.trim().length > 0 &&
        Array.isArray(q.choices) && 
        q.choices.length === 4 &&
        q.choices.every((c: any) => typeof c === 'string' && c.trim().length > 0) &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 &&
        q.correctAnswer < 4 &&
        q.hint &&
        typeof q.hint === 'string' &&
        q.hint.trim().length > 0
      )
      .map((q: any) => ({
        question: q.question.trim(),
        choices: q.choices.map((c: string) => c.trim()),
        correctAnswer: q.correctAnswer,
        hint: q.hint.trim()
      }))
      .slice(0, 3);
    
    if (validQuestions.length === 3) {
      console.log('Successfully parsed quiz questions from AI response');
      return validQuestions;
    } else if (validQuestions.length > 0) {
      console.log(`Only parsed ${validQuestions.length} valid questions, using fallback`);
    }
  }

  // Fallback quiz if parsing fails - but log the issue
  console.error('Failed to parse quiz JSON. Response text:', cleanedText.substring(0, 500));
  console.error('Original content length:', originalContent.length);
  
  // Try to generate a better fallback based on content keywords
  const betterFallback = generateContextualFallback(originalContent);
  if (betterFallback) {
    return betterFallback;
  }
  
  return generateFallbackQuiz();
}

function generateContextualFallback(content: string): QuizQuestion[] | null {
  // Extract key terms from content to make fallback more relevant
  const lowerContent = content.toLowerCase();
  
  // Check for physics/math keywords
  const hasPhysics = /force|acceleration|velocity|momentum|energy|newton|f=ma|kinematics/i.test(content);
  const hasMath = /calculus|derivative|integral|limit|function|equation/i.test(content);
  const hasChemistry = /molecule|atom|reaction|compound|element/i.test(content);
  
  if (hasPhysics && /net force|f_net|f_{net}/i.test(content)) {
    return [
      {
        question: "What does Newton's second law state about net force?",
        choices: [
          "F_net = ma, where force equals mass times acceleration",
          "F_net = mv, where force equals mass times velocity",
          "F_net = m/a, where force equals mass divided by acceleration",
          "Net force is always zero"
        ],
        correctAnswer: 0,
        hint: "Newton's second law relates force, mass, and acceleration."
      },
      {
        question: "If a 10 kg object experiences a net force of 50 N, what is its acceleration?",
        choices: [
          "5 m/s²",
          "50 m/s²",
          "0.2 m/s²",
          "500 m/s²"
        ],
        correctAnswer: 0,
        hint: "Use F = ma and solve for acceleration: a = F/m"
      },
      {
        question: "What happens to acceleration if the net force doubles while mass stays constant?",
        choices: [
          "Acceleration doubles",
          "Acceleration halves",
          "Acceleration stays the same",
          "Acceleration quadruples"
        ],
        correctAnswer: 0,
        hint: "From F = ma, if F doubles and m is constant, a must double."
      }
    ];
  }
  
  // Add more contextual fallbacks for other topics as needed
  return null;
}

function generateFallbackQuiz(): QuizQuestion[] {
  return [
    {
      question: "What was the main topic discussed in the conversation?",
      choices: [
        "A mathematical concept",
        "A scientific principle",
        "A study strategy",
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "Consider all aspects of the conversation."
    },
    {
      question: "Which of the following best summarizes the key takeaway?",
      choices: [
        "Practice is essential",
        "Understanding fundamentals is important",
        "Both practice and understanding are crucial",
        "Memorization is sufficient"
      ],
      correctAnswer: 2,
      hint: "Think about what makes learning effective."
    },
    {
      question: "How can you apply this knowledge?",
      choices: [
        "Through regular practice",
        "By teaching others",
        "By solving related problems",
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "Multiple approaches can be effective."
    }
  ];
}

