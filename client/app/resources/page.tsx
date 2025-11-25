'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import BookGrid from '@/components/features/books/BookGrid';
import { books } from '@/data/books';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter books based on search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
