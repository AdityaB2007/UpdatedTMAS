'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import BookGrid from '@/components/features/books/BookGrid';
import { books, getBookById } from '@/data/books';
import { ArrowLeft, BookOpen, ChevronDown, FileText, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Separate component that uses useSearchParams
function ResourcesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Check for book param on mount and when searchParams change
  useEffect(() => {
    const bookParam = searchParams?.get('book');
    if (bookParam) {
      const book = getBookById(bookParam);
      if (book && book.pdfPath) {
        setSelectedBookId(bookParam);
      }
    }
  }, [searchParams]);

  // Filter books based on search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the selected book details
  const selectedBook = selectedBookId ? getBookById(selectedBookId) : null;

  // Books with PDFs for the dropdown
  const booksWithPdfs = books.filter(book => book.pdfPath);

  // Handle book selection from dropdown
  const handleBookSelect = (bookId: string) => {
    if (bookId) {
      router.push(`/resources?book=${bookId}`);
    } else {
      router.push('/resources');
      setSelectedBookId(null);
    }
  };

  // Handle back to browse
  const handleBackToBrowse = () => {
    router.push('/resources');
    setSelectedBookId(null);
  };

  // If a book is selected, show the PDF viewer
  if (selectedBook && selectedBook.pdfPath) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        paddingTop: '100px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header with back button and dropdown */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--glass-border)'
          }}>
            {/* Left side - Back button and title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleBackToBrowse}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Browse All
              </button>
              <div>
                <h1 style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '4px'
                }}>
                  {selectedBook.title}
                </h1>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  by {selectedBook.authors ? selectedBook.authors.join(', ') : selectedBook.author}
                </p>
              </div>
            </div>

            {/* Right side - Book selector dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedBookId || ''}
                onChange={(e) => handleBookSelect(e.target.value)}
                style={{
                  appearance: 'none',
                  padding: '10px 40px 10px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  minWidth: '250px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-yellow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--glass-border)';
                }}
              >
                <option value="">Switch book...</option>
                {booksWithPdfs.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
              <ChevronDown style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: 'var(--text-tertiary)',
                pointerEvents: 'none'
              }} />
            </div>
          </div>

          {/* Book stats bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)'
            }}>
              <FileText style={{ width: '16px', height: '16px', color: 'var(--accent-yellow)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {selectedBook.pageCount} pages
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)'
            }}>
              <Users style={{ width: '16px', height: '16px', color: 'var(--accent-yellow)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {selectedBook.problemCount} problems
              </span>
            </div>
            <a
              href={selectedBook.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'var(--accent-yellow)',
                color: 'var(--bg-primary)',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-amber)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-yellow)';
              }}
            >
              <ExternalLink style={{ width: '16px', height: '16px' }} />
              Open in New Tab
            </a>
          </div>

          {/* PDF Viewer */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            marginBottom: '40px'
          }}>
            <iframe
              src={selectedBook.pdfPath}
              style={{
                width: '100%',
                height: 'calc(100vh - 280px)',
                minHeight: '600px',
                border: 'none',
                display: 'block'
              }}
              title={`${selectedBook.title} PDF`}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default view - Book grid
  return (
    <PageLayout
      title="Study Guides"
      subtitle="Free, comprehensive study guides for AP courses and competition math"
    >
      {/* Simple Search Bar */}
      <div style={{ marginBottom: '48px' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            display: 'block',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-yellow)';
            e.target.style.boxShadow = '0 0 0 2px rgba(250, 204, 21, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--glass-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <BookGrid books={filteredBooks} />
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            No books found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </PageLayout>
  );
}

// Main component with Suspense boundary
export default function Resources() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <BookOpen style={{
          width: '48px',
          height: '48px',
          color: 'var(--text-tertiary)',
          animation: 'pulse 2s infinite'
        }} />
      </div>
    }>
      <ResourcesContent />
    </Suspense>
  );
}
