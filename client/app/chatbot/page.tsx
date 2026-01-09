'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, User, BookOpen, HelpCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { marked } from 'marked';
import { Book } from '@/data/books';
import Link from 'next/link';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Function to normalize markdown content for proper rendering
function normalizeMarkdown(content: string): string {
  let normalized = content;

  // Convert escaped newlines to actual newlines
  normalized = normalized.replace(/\\n/g, '\n');

  // Ensure headers have line breaks before them
  normalized = normalized.replace(/([^\n])(\s*)(#{1,6}\s)/g, '$1\n\n$3');

  // Ensure numbered lists have line breaks before them
  normalized = normalized.replace(/([^\n])(\s*)(\d+\.\s)/g, '$1\n\n$3');

  // Ensure bullet lists have line breaks before them
  normalized = normalized.replace(/([^\n])(\s*)([-*]\s)/g, '$1\n\n$3');

  // Ensure tables have proper line breaks (detect table row patterns)
  // Add line break before table headers
  normalized = normalized.replace(/([^\n])(\s*)(\|[^|]+\|)/g, (match, before, space, table) => {
    // Only add newline if this looks like a table row start
    if (table.includes('|')) {
      return before + '\n\n' + table;
    }
    return match;
  });

  // Fix table separators to be on their own lines
  normalized = normalized.replace(/(\|[^\n]*\|)(\s*)(\|[-:\s|]+\|)/g, '$1\n$3');

  // Ensure there's a line break after table separator rows
  normalized = normalized.replace(/(\|[-:\s|]+\|)(\s*)(\|)/g, '$1\n$3');

  // Clean up excessive newlines (more than 2 in a row)
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  return normalized.trim();
}

// Function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Function to decode HTML entities in text
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Function to render LaTeX math expressions in content (handles both HTML and plain text)
function renderMath(content: string, isHtml: boolean = false): string {
  // Decode HTML entities first (content from API may have encoded entities like &#39;)
  // This ensures entities like &#39; are converted to ' before processing
  let decodedContent = decodeHtmlEntities(content);

  // If content is already HTML (from markdown), use decoded content as-is
  // If it's plain text, we still need to escape HTML tags for security,
  // but entities are already decoded so they'll display correctly
  let processedContent = isHtml ? decodedContent : escapeHtml(decodedContent);

  // Helper function to clean math content
  const cleanMathContent = (math: string): string => {
    return math
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/<\/?p>/g, '')
      .replace(/<br\s*\/?>/g, '')
      .replace(/<\/?em>/g, '')
      .replace(/<\/?strong>/g, '');
  };

  // Render block math ($$...$$) - non-greedy match to handle multiple blocks
  processedContent = processedContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      const trimmed = math.trim();
      if (trimmed.length === 0) return match;
      const decoded = cleanMathContent(trimmed);
      return katex.renderToString(decoded, { displayMode: true, throwOnError: false });
    } catch (e) {
      console.warn('KaTeX rendering error for block math:', e);
      return match;
    }
  });

  // Handle \[ \] for display math (common LaTeX notation)
  processedContent = processedContent.replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
    try {
      const trimmed = math.trim();
      if (trimmed.length === 0) return match;
      const decoded = cleanMathContent(trimmed);
      return katex.renderToString(decoded, { displayMode: true, throwOnError: false });
    } catch (e) {
      console.warn('KaTeX rendering error for \\[ \\] math:', e);
      return match;
    }
  });

  // Render inline math ($...$) - avoid matching block math
  // Match $...$ but not $$...$$
  processedContent = processedContent.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, (match, math) => {
    try {
      const trimmed = math.trim();
      if (trimmed.length === 0) return match;
      // Skip if it looks like HTML tag content or currency
      if (trimmed.match(/^<|>$/) || trimmed.match(/^\d+,?\d*$/)) return match;
      const decoded = cleanMathContent(trimmed);
      return katex.renderToString(decoded, { displayMode: false, throwOnError: false });
    } catch (e) {
      console.warn('KaTeX rendering error for inline math:', e);
      return match;
    }
  });

  // Handle \( \) for inline math (common LaTeX notation)
  processedContent = processedContent.replace(/\\\((.+?)\\\)/g, (match, math) => {
    try {
      const trimmed = math.trim();
      if (trimmed.length === 0) return match;
      const decoded = cleanMathContent(trimmed);
      return katex.renderToString(decoded, { displayMode: false, throwOnError: false });
    } catch (e) {
      console.warn('KaTeX rendering error for \\( \\) math:', e);
      return match;
    }
  });

  return processedContent;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  // Special content types that become part of message history
  quizData?: QuizState;
  booksData?: {
    books: Book[];
    topics: Array<{ topic: string; relevance: number; description: string }>;
  };
}

interface QuizQuestion {
  question: string;
  choices: string[];
  correctAnswer: number;
  hint: string;
}

interface QuizState {
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  showHints: boolean[];
  showResults: boolean[];
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [chatId, setChatId] = useState('');
  const [isNewChat, setIsNewChat] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // New state for book recommendations and quiz
  const [hasAiResponded, setHasAiResponded] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState('');
  const [topics, setTopics] = useState<Array<{ topic: string; relevance: number; description: string }>>([]);
  const [practiceProblems, setPracticeProblems] = useState<Record<string, Array<{
    bookId: string;
    bookTitle: string;
    problemNumber?: string;
    pageNumber?: string;
    chapter?: string;
    section?: string;
    description: string;
    relevance: number;
  }>>>({});
  const [loadingProblems, setLoadingProblems] = useState<Record<string, boolean>>({});

  // Auto-authenticate on mount
  useEffect(() => {
    authenticateUser();
  }, []);

  // Scroll to bottom of messages container (internal scroll only)
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Only scroll to bottom when a new assistant message is added (not on user input)
  const lastMessageRef = useRef<string | null>(null);
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    // Auto-scroll when new message is added or when streaming updates
    if (lastMessage && lastMessage.id !== lastMessageRef.current) {
      lastMessageRef.current = lastMessage.id;
      scrollToBottom();
    } else if (lastMessage && lastMessage.role === 'assistant') {
      // Also scroll during streaming updates
      scrollToBottom();
    }
  }, [messages]);

  const authenticateUser = async () => {
    try {
      setIsAuthenticating(true);
      setAuthError('');

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setIsAuthenticating(false);
        console.log('Authentication successful');
      } else {
        setAuthError(data.error || 'Authentication failed');
        setIsAuthenticating(false);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setAuthError('Failed to connect to authentication service');
      setIsAuthenticating(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isAuthenticated || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Generate chatId for new chat
    const currentChatId = chatId || generateUUID();
    if (!chatId) {
      setChatId(currentChatId);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          idToken: authToken,
          chatId: currentChatId,
          createNewChat: isNewChat,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Mark as no longer new chat after first message
      if (isNewChat) {
        setIsNewChat(false);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Try to parse JSON objects from the buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsed = JSON.parse(line);
                if (parsed.content) {
                  assistantContent = parsed.content;

                  // Update or add assistant message
                  setMessages((prev) => {
                    const existingIndex = prev.findIndex((msg) => msg.id === assistantMessageId);
                    const assistantMessage: Message = {
                      id: assistantMessageId,
                      role: 'assistant',
                      content: assistantContent,
                      timestamp: new Date(),
                    };

                    if (existingIndex >= 0) {
                      const updated = [...prev];
                      updated[existingIndex] = assistantMessage;
                      return updated;
                    } else {
                      return [...prev, assistantMessage];
                    }
                  });
                }
              } catch {
                // Incomplete JSON, continue
              }
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer);
            if (parsed.content) {
              assistantContent = parsed.content;
              setMessages((prev) => {
                const existingIndex = prev.findIndex((msg) => msg.id === assistantMessageId);
                const assistantMessage: Message = {
                  id: assistantMessageId,
                  role: 'assistant',
                  content: assistantContent,
                  timestamp: new Date(),
                };

                if (existingIndex >= 0) {
                  const updated = [...prev];
                  updated[existingIndex] = assistantMessage;
                  return updated;
                } else {
                  return [...prev, assistantMessage];
                }
              });
            }
          } catch {
            // Ignore parse errors on final buffer
          }
        }
        
        // Mark that AI has responded and store the final response
        if (assistantContent) {
          setHasAiResponded(true);
          setLastAiResponse(assistantContent);
        }
      } else {
        // Fallback for non-streaming response
        const data = await response.json();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: data.content || data.response || data.message || 'No response received',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setHasAiResponded(true);
        setLastAiResponse(assistantMessage.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleRecommendBooks = async () => {
    if (!isAuthenticated || isLoadingBooks) return;

    setIsLoadingBooks(true);
    try {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const userQuery = lastUserMessage?.content || '';

      const response = await fetch('/api/recommend-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          idToken: authToken,
          chatId: chatId || generateUUID(),
        }),
      });

      const data = await response.json();
      if (data.books || data.topics) {
        // Add books recommendation as a message so it scrolls with chat
        const booksMessage: Message = {
          id: `books-${Date.now()}`,
          role: 'assistant',
          content: 'Here are some recommended books based on our conversation:',
          timestamp: new Date(),
          booksData: {
            books: data.books || [],
            topics: data.topics || [],
          },
        };
        setMessages(prev => [...prev, booksMessage]);
      }
    } catch (error) {
      console.error('Error fetching book recommendations:', error);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const handleGetPracticeProblems = async (bookId: string) => {
    if (!isAuthenticated || loadingProblems[bookId]) return;
    
    // Check if we already have problems for this book
    if (practiceProblems[bookId]) {
      return;
    }
    
    setLoadingProblems(prev => ({ ...prev, [bookId]: true }));
    try {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const userQuery = lastUserMessage?.content || '';
      
      const response = await fetch('/api/recommend-problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery,
          bookId,
          idToken: authToken,
          chatId: chatId || generateUUID(),
        }),
      });

      const data = await response.json();
      if (data.problems && Array.isArray(data.problems)) {
        setPracticeProblems(prev => ({
          ...prev,
          [bookId]: data.problems
        }));
      }
    } catch (error) {
      console.error('Error fetching practice problems:', error);
    } finally {
      setLoadingProblems(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const handleGenerateQuiz = async () => {
    if (!isAuthenticated || isLoadingQuiz || !lastAiResponse) return;

    setIsLoadingQuiz(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aiResponse: lastAiResponse,
          idToken: authToken,
          chatId: chatId || generateUUID(),
        }),
      });

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length === 3) {
        // Add quiz as a message so it scrolls with chat
        const quizMessage: Message = {
          id: `quiz-${Date.now()}`,
          role: 'assistant',
          content: 'Test your knowledge with this quiz:',
          timestamp: new Date(),
          quizData: {
            questions: data.questions,
            userAnswers: [null, null, null],
            showHints: [false, false, false],
            showResults: [false, false, false],
          },
        };
        setMessages(prev => [...prev, quizMessage]);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleQuizAnswer = (messageId: string, questionIndex: number, answerIndex: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId || !msg.quizData) return msg;

      const newAnswers = [...msg.quizData.userAnswers];
      newAnswers[questionIndex] = answerIndex;

      const newResults = [...msg.quizData.showResults];
      newResults[questionIndex] = true;

      return {
        ...msg,
        quizData: {
          ...msg.quizData,
          userAnswers: newAnswers,
          showResults: newResults,
        },
      };
    }));
  };

  const toggleHint = (messageId: string, questionIndex: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId || !msg.quizData) return msg;

      const newHints = [...msg.quizData.showHints];
      newHints[questionIndex] = !newHints[questionIndex];

      return {
        ...msg,
        quizData: {
          ...msg.quizData,
          showHints: newHints,
        },
      };
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isAuthenticating) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Loader2
            size={48}
            style={{
              color: 'var(--accent-yellow)',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          padding: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: '32rem',
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: 'var(--accent-orange)', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Authentication Failed
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {authError}
          </p>
          <button
            onClick={authenticateUser}
            style={{
              background: 'var(--accent-yellow)',
              color: 'var(--bg-primary)',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--accent-amber)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--accent-yellow)';
            }}
          >
            Retry Authentication
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '1.5rem 2rem',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                background: 'var(--accent-yellow)',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={24} style={{ color: 'var(--bg-primary)' }} />
            </div>
            <div>
              <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700 }}>
                TMAS AI Assistant
              </h1>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                Ask me anything about math and science
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <Bot
                size={64}
                style={{
                  color: 'var(--text-tertiary)',
                  margin: '0 auto 1.5rem',
                  opacity: 0.5,
                }}
              />
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Start a conversation
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Ask me questions about AP courses, math concepts, physics problems, or study tips!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.5rem',
                      background:
                        message.role === 'user'
                          ? 'var(--bg-tertiary)'
                          : 'var(--accent-yellow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {message.role === 'user' ? (
                      <User size={20} style={{ color: 'var(--text-primary)' }} />
                    ) : (
                      <Bot size={20} style={{ color: 'var(--bg-primary)' }} />
                    )}
                  </div>

                  {/* Message Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className={message.role === 'assistant' ? 'markdown-content' : ''}
                      style={{
                        background:
                          message.role === 'user'
                            ? 'var(--bg-tertiary)'
                            : 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '0.75rem',
                        padding: '1rem 1.25rem',
                        color: 'var(--text-secondary)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        whiteSpace: message.role === 'user' ? 'pre-wrap' : 'normal',
                        wordWrap: 'break-word',
                      }}
                      dangerouslySetInnerHTML={
                        message.role === 'assistant'
                          ? { __html: renderMath(marked.parse(normalizeMarkdown(message.content)) as string, true) }
                          : undefined
                      }
                    >
                      {message.role === 'user' ? message.content : null}
                    </div>
                    <div
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.75rem',
                        marginTop: '0.5rem',
                        paddingLeft: '0.25rem',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    
                    {/* Action Buttons - Show after AI responds */}
                    {message.role === 'assistant' && message.id === messages.filter(m => m.role === 'assistant').pop()?.id && hasAiResponded && (
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={handleRecommendBooks}
                          disabled={isLoadingBooks}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: isLoadingBooks ? 'var(--bg-tertiary)' : 'var(--accent-yellow)',
                            color: isLoadingBooks ? 'var(--text-tertiary)' : 'var(--bg-primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: isLoadingBooks ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.3s',
                          }}
                          onMouseOver={(e) => {
                            if (!isLoadingBooks) {
                              e.currentTarget.style.background = 'var(--accent-amber)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isLoadingBooks) {
                              e.currentTarget.style.background = 'var(--accent-yellow)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {isLoadingBooks ? (
                            <>
                              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                              Loading...
                            </>
                          ) : (
                            <>
                              <BookOpen size={16} />
                              Recommend Books
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={handleGenerateQuiz}
                          disabled={isLoadingQuiz}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: isLoadingQuiz ? 'var(--bg-tertiary)' : 'var(--accent-orange)',
                            color: isLoadingQuiz ? 'var(--text-tertiary)' : 'var(--bg-primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: isLoadingQuiz ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.3s',
                          }}
                          onMouseOver={(e) => {
                            if (!isLoadingQuiz) {
                              e.currentTarget.style.background = 'rgba(255, 107, 0, 0.9)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isLoadingQuiz) {
                              e.currentTarget.style.background = 'var(--accent-orange)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {isLoadingQuiz ? (
                            <>
                              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                              Generating...
                            </>
                          ) : (
                            <>
                              <HelpCircle size={16} />
                              Generate Quiz
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Inline Books Data */}
                    {message.booksData && (
                      <>
                        {/* Topics */}
                        {message.booksData.topics.length > 0 && (
                          <div
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: '0.75rem',
                              padding: '1.25rem',
                              marginTop: '1rem',
                            }}
                          >
                            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Lightbulb size={18} style={{ color: 'var(--accent-yellow)' }} />
                              Relevant Topics
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {message.booksData.topics.map((topic, index) => (
                                <div
                                  key={index}
                                  style={{
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '0.375rem',
                                    padding: '0.375rem 0.625rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                  }}
                                >
                                  <span style={{ color: 'var(--text-primary)', fontSize: '0.8125rem', fontWeight: 500 }}>
                                    {topic.topic}
                                  </span>
                                  <span style={{ color: 'var(--accent-yellow)', fontSize: '0.75rem', fontWeight: 500 }}>
                                    {Math.round(topic.relevance * 100)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Books */}
                        {message.booksData.books.length > 0 && (
                          <div
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: '0.75rem',
                              padding: '1.25rem',
                              marginTop: '0.75rem',
                            }}
                          >
                            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <BookOpen size={18} style={{ color: 'var(--accent-yellow)' }} />
                              Recommended Books
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {message.booksData.books.map((book) => (
                                <Link
                                  key={book.id}
                                  href={`/resources?book=${book.id}`}
                                  style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                  <div
                                    style={{
                                      background: 'var(--bg-tertiary)',
                                      border: '1px solid var(--glass-border)',
                                      borderRadius: '0.5rem',
                                      padding: '0.875rem',
                                      transition: 'all 0.2s',
                                      cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--accent-yellow)';
                                      e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                                      e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                  >
                                    <h5 style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                      {book.title}
                                    </h5>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                                      by {book.authors ? book.authors.join(', ') : book.author}
                                    </p>
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', margin: 0 }}>
                                      {book.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Inline Quiz Data */}
                    {message.quizData && message.quizData.questions.length > 0 && (
                      <div
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '0.75rem',
                          padding: '1.25rem',
                          marginTop: '1rem',
                        }}
                      >
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <HelpCircle size={18} style={{ color: 'var(--accent-orange)' }} />
                          Quiz: Test Your Knowledge
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {message.quizData.questions.map((question, qIndex) => {
                            const quizData = message.quizData!;
                            const userAnswer = quizData.userAnswers[qIndex];
                            const showResult = quizData.showResults[qIndex];
                            const isCorrect = userAnswer === question.correctAnswer;

                            return (
                              <div
                                key={qIndex}
                                style={{
                                  background: 'var(--bg-tertiary)',
                                  border: '1px solid var(--glass-border)',
                                  borderRadius: '0.5rem',
                                  padding: '1rem',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                  <h5
                                    style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', fontWeight: 600, flex: 1 }}
                                    dangerouslySetInnerHTML={{ __html: `Q${qIndex + 1}: ${renderMath(question.question)}` }}
                                  />
                                  <button
                                    onClick={() => toggleHint(message.id, qIndex)}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid var(--glass-border)',
                                      borderRadius: '0.25rem',
                                      padding: '0.25rem 0.375rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      color: 'var(--text-tertiary)',
                                      fontSize: '0.6875rem',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--accent-yellow)';
                                      e.currentTarget.style.color = 'var(--accent-yellow)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                                      e.currentTarget.style.color = 'var(--text-tertiary)';
                                    }}
                                  >
                                    <Lightbulb size={12} />
                                    Hint
                                  </button>
                                </div>

                                {quizData.showHints[qIndex] && (
                                  <div
                                    style={{
                                      background: 'rgba(255, 193, 7, 0.1)',
                                      border: '1px solid rgba(255, 193, 7, 0.3)',
                                      borderRadius: '0.25rem',
                                      padding: '0.5rem 0.75rem',
                                      marginBottom: '0.75rem',
                                      color: 'var(--text-secondary)',
                                      fontSize: '0.8125rem',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: `💡 ${renderMath(question.hint)}` }}
                                  />
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                  {question.choices.map((choice, cIndex) => {
                                    const isSelected = userAnswer === cIndex;
                                    const isCorrectChoice = cIndex === question.correctAnswer;
                                    let bgColor = 'var(--bg-secondary)';
                                    let borderColor = 'var(--glass-border)';

                                    if (showResult) {
                                      if (isSelected && isCorrectChoice) {
                                        bgColor = 'rgba(34, 197, 94, 0.2)';
                                        borderColor = 'rgba(34, 197, 94, 0.5)';
                                      } else if (isSelected && !isCorrectChoice) {
                                        bgColor = 'rgba(239, 68, 68, 0.2)';
                                        borderColor = 'rgba(239, 68, 68, 0.5)';
                                      } else if (isCorrectChoice) {
                                        bgColor = 'rgba(34, 197, 94, 0.1)';
                                        borderColor = 'rgba(34, 197, 94, 0.3)';
                                      }
                                    }

                                    return (
                                      <button
                                        key={cIndex}
                                        onClick={() => !showResult && handleQuizAnswer(message.id, qIndex, cIndex)}
                                        disabled={showResult}
                                        style={{
                                          background: bgColor,
                                          border: `1px solid ${borderColor}`,
                                          borderRadius: '0.25rem',
                                          padding: '0.5rem 0.75rem',
                                          cursor: showResult ? 'default' : 'pointer',
                                          textAlign: 'left',
                                          color: 'var(--text-primary)',
                                          fontSize: '0.8125rem',
                                          transition: 'all 0.2s',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.375rem',
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!showResult) {
                                            e.currentTarget.style.borderColor = 'var(--accent-yellow)';
                                            e.currentTarget.style.background = 'rgba(255, 193, 7, 0.1)';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!showResult) {
                                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                                            e.currentTarget.style.background = 'var(--bg-secondary)';
                                          }
                                        }}
                                      >
                                        <span style={{ fontWeight: 500, minWidth: '1.25rem' }}>
                                          {String.fromCharCode(65 + cIndex)}.
                                        </span>
                                        <span
                                          style={{ flex: 1 }}
                                          dangerouslySetInnerHTML={{ __html: renderMath(choice) }}
                                        />
                                        {showResult && isSelected && (
                                          isCorrectChoice ? (
                                            <CheckCircle2 size={16} style={{ color: 'rgba(34, 197, 94, 1)' }} />
                                          ) : (
                                            <XCircle size={16} style={{ color: 'rgba(239, 68, 68, 1)' }} />
                                          )
                                        )}
                                        {showResult && !isSelected && isCorrectChoice && (
                                          <CheckCircle2 size={16} style={{ color: 'rgba(34, 197, 94, 1)' }} />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {showResult && (
                                  <div
                                    style={{
                                      marginTop: '0.75rem',
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: '0.25rem',
                                      background: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                      color: isCorrect ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
                                      fontSize: '0.8125rem',
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.375rem',
                                    }}
                                  >
                                    {isCorrect ? (
                                      <>
                                        <CheckCircle2 size={16} />
                                        Correct!
                                      </>
                                    ) : (
                                      <>
                                        <XCircle size={16} />
                                        <span dangerouslySetInnerHTML={{ __html: `Incorrect. Answer: ${String.fromCharCode(65 + question.correctAnswer)}` }} />
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.5rem',
                      background: 'var(--accent-yellow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bot size={20} style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '0.75rem',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Loader2
                      size={16}
                      style={{
                        color: 'var(--accent-yellow)',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <span style={{ color: 'var(--text-tertiary)' }}>Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--glass-border)',
          padding: '1.5rem 1rem',
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-yellow)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                background: inputMessage.trim() && !isLoading
                  ? 'var(--accent-yellow)'
                  : 'var(--bg-tertiary)',
                color: inputMessage.trim() && !isLoading
                  ? 'var(--bg-primary)'
                  : 'var(--text-tertiary)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                minWidth: '3.5rem',
                height: '3.5rem',
              }}
              onMouseOver={(e) => {
                if (inputMessage.trim() && !isLoading) {
                  e.currentTarget.style.background = 'var(--accent-amber)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (inputMessage.trim() && !isLoading) {
                  e.currentTarget.style.background = 'var(--accent-yellow)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Markdown content styles */
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          color: var(--text-primary);
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }

        .markdown-content h1 { font-size: 1.5em; }
        .markdown-content h2 { font-size: 1.3em; }
        .markdown-content h3 { font-size: 1.1em; }

        .markdown-content p {
          margin-bottom: 0.75em;
        }

        .markdown-content p:last-child {
          margin-bottom: 0;
        }

        .markdown-content a {
          color: var(--accent-yellow);
          text-decoration: underline;
        }

        .markdown-content a:hover {
          color: var(--accent-amber);
        }

        .markdown-content strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .markdown-content em {
          font-style: italic;
        }

        .markdown-content code {
          background: var(--bg-tertiary);
          color: var(--accent-yellow);
          padding: 0.15em 0.4em;
          border-radius: 4px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 0.9em;
        }

        .markdown-content pre {
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 1em;
          overflow-x: auto;
          margin: 0.75em 0;
        }

        .markdown-content pre code {
          background: transparent;
          padding: 0;
          color: var(--text-secondary);
        }

        .markdown-content ul,
        .markdown-content ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }

        .markdown-content li {
          margin-bottom: 0.25em;
        }

        .markdown-content li::marker {
          color: var(--accent-yellow);
        }

        .markdown-content blockquote {
          border-left: 3px solid var(--accent-yellow);
          padding-left: 1em;
          margin: 0.75em 0;
          color: var(--text-tertiary);
          font-style: italic;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75em 0;
        }

        .markdown-content th,
        .markdown-content td {
          border: 1px solid var(--glass-border);
          padding: 0.5em;
          text-align: left;
        }

        .markdown-content th {
          background: var(--bg-tertiary);
          color: var(--accent-yellow);
          font-weight: 600;
        }

        .markdown-content hr {
          border: none;
          border-top: 1px solid var(--glass-border);
          margin: 1em 0;
        }

        /* KaTeX math rendering styles */
        .markdown-content .katex {
          font-size: 1.1em;
          color: var(--text-primary);
        }

        .markdown-content .katex-display {
          margin: 1em 0;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .markdown-content .katex-display > .katex {
          display: inline-block;
          text-align: initial;
        }
      `}</style>
    </div>
  );
}
