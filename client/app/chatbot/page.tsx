'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-authenticate on mount
  useEffect(() => {
    authenticateUser();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_ENDPOINT || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

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
      } else {
        // Fallback for non-streaming response
        const data = await response.json();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: data.response || data.message || 'No response received',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
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
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '1.5rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(12px)',
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
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                      }}
                    >
                      {message.content}
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
          position: 'sticky',
          bottom: 0,
          backdropFilter: 'blur(12px)',
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

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
