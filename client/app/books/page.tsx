'use client';

import { useState } from 'react';
import Link from 'next/link';
import { books as allBooks } from '@/data/books';
import { BookOpen, Search, ArrowRight, FileText, Users } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PdfCover to avoid SSR issues
const PdfCover = dynamic(() => import('@/components/features/books/PdfCover'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <BookOpen style={{ width: '32px', height: '32px', color: 'var(--text-tertiary)' }} />
    </div>
  )
});

// Filter to only books with PDFs
const booksWithPdfs = allBooks.filter(book => book.pdfPath);

// Warm color palette for cards
const warmColors = [
  { border: '#ef4444', hover: '#dc2626', bg: 'rgba(239, 68, 68, 0.06)', shadow: 'rgba(239, 68, 68, 0.2)', accent: '#ef4444' },
  { border: '#f97316', hover: '#ea580c', bg: 'rgba(249, 115, 22, 0.06)', shadow: 'rgba(249, 115, 22, 0.2)', accent: '#f97316' },
  { border: '#f59e0b', hover: '#d97706', bg: 'rgba(245, 158, 11, 0.06)', shadow: 'rgba(245, 158, 11, 0.2)', accent: '#f59e0b' },
  { border: '#eab308', hover: '#ca8a04', bg: 'rgba(234, 179, 8, 0.06)', shadow: 'rgba(234, 179, 8, 0.2)', accent: '#eab308' },
];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  const filteredBooks = booksWithPdfs.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '120px',
      paddingBottom: '80px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            Study Guide Library
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Browse our collection of free, comprehensive study guides for AP courses and competition math
          </p>

          {/* Search Bar */}
          <div style={{
            position: 'relative',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <Search style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'var(--text-tertiary)'
            }} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-yellow)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 248, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--glass-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {filteredBooks.map((book, index) => {
              const colors = warmColors[index % warmColors.length];
              const isHovered = hoveredBook === book.id;

              return (
                <Link
                  key={book.id}
                  href={`/resources?book=${book.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    onMouseEnter={() => setHoveredBook(book.id)}
                    onMouseLeave={() => setHoveredBook(null)}
                    style={{
                      backgroundColor: isHovered ? colors.bg : 'var(--bg-secondary)',
                      borderRadius: '16px',
                      border: `1px solid ${isHovered ? colors.border : 'var(--glass-border)'}`,
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                      boxShadow: isHovered
                        ? `0 20px 40px ${colors.shadow}`
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Book Cover */}
                    <div style={{
                      height: '200px',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: `2px solid ${isHovered ? colors.border : 'var(--glass-border)'}`,
                      transition: 'border-color 0.3s ease',
                      overflow: 'hidden'
                    }}>
                      {book.pdfPath ? (
                        <div style={{ width: '140px', height: '180px' }}>
                          <PdfCover pdfPath={book.pdfPath} width={140} height={180} />
                        </div>
                      ) : (
                        <BookOpen style={{
                          width: '64px',
                          height: '64px',
                          color: isHovered ? colors.accent : 'var(--text-tertiary)',
                          transition: 'color 0.3s ease'
                        }} />
                      )}
                    </div>

                    {/* Book Info */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                        lineHeight: 1.3
                      }}>
                        {book.title}
                      </h3>

                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '16px'
                      }}>
                        by {book.authors ? book.authors.join(', ') : book.author}
                      </p>

                      {/* Stats Row */}
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <FileText style={{
                            width: '14px',
                            height: '14px',
                            color: isHovered ? colors.accent : 'var(--text-tertiary)',
                            transition: 'color 0.3s ease'
                          }} />
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-tertiary)'
                          }}>
                            {book.pageCount} pages
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Users style={{
                            width: '14px',
                            height: '14px',
                            color: isHovered ? colors.accent : 'var(--text-tertiary)',
                            transition: 'color 0.3s ease'
                          }} />
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-tertiary)'
                          }}>
                            {book.problemCount} problems
                          </span>
                        </div>
                      </div>

                      {/* Read Button */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--glass-border)'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: isHovered ? colors.accent : 'var(--text-secondary)',
                          transition: 'color 0.3s ease'
                        }}>
                          Read Now
                        </span>
                        <ArrowRight style={{
                          width: '18px',
                          height: '18px',
                          color: isHovered ? colors.accent : 'var(--text-tertiary)',
                          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                          transition: 'all 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)'
          }}>
            <BookOpen style={{
              width: '48px',
              height: '48px',
              color: 'var(--text-tertiary)',
              margin: '0 auto 16px'
            }} />
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.125rem'
            }}>
              No books found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
