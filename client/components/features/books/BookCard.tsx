'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '@/data/books';
import { BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PdfCover to avoid SSR issues
const PdfCover = dynamic(() => import('./PdfCover'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '80px',
      height: '104px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <BookOpen style={{ width: '24px', height: '24px', color: 'var(--text-secondary)' }} />
    </div>
  )
});

interface BookCardProps {
  book: Book;
  colorIndex?: number;
}

// Warm color palette
const warmColors = [
  { border: '#ef4444', hover: '#dc2626', bg: 'rgba(239, 68, 68, 0.03)', shadow: 'rgba(239, 68, 68, 0.15)', icon: '#ef4444' }, // red
  { border: '#f97316', hover: '#ea580c', bg: 'rgba(249, 115, 22, 0.03)', shadow: 'rgba(249, 115, 22, 0.15)', icon: '#f97316' }, // orange
  { border: '#f59e0b', hover: '#d97706', bg: 'rgba(245, 158, 11, 0.03)', shadow: 'rgba(245, 158, 11, 0.15)', icon: '#f59e0b' }, // amber
  { border: '#eab308', hover: '#ca8a04', bg: 'rgba(234, 179, 8, 0.03)', shadow: 'rgba(234, 179, 8, 0.15)', icon: '#eab308' }, // yellow
];

export default function BookCard({ book, colorIndex = 0 }: BookCardProps) {
  const colors = warmColors[colorIndex % warmColors.length];
  const hasPdf = !!book.pdfPath;

  return (
    <Link
      href="/resources"
      style={{
        display: 'block',
        height: '100%',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid var(--glass-border)',
          borderTop: `2px solid ${colors.border}`,
          backgroundColor: 'var(--bg-secondary)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderTopColor = colors.hover;
          e.currentTarget.style.backgroundColor = colors.bg;
          e.currentTarget.style.boxShadow = `0 8px 30px ${colors.shadow}`;
          const icon = e.currentTarget.querySelector('.book-icon') as HTMLElement;
          if (icon) icon.style.color = colors.icon;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderTopColor = colors.border;
          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          e.currentTarget.style.boxShadow = 'none';
          const icon = e.currentTarget.querySelector('.book-icon') as HTMLElement;
          if (icon) icon.style.color = 'var(--text-secondary)';
        }}
      >
        {/* PDF Cover or Book Icon */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start'
        }}>
          {hasPdf ? (
            <div style={{
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <PdfCover pdfPath={book.pdfPath!} width={80} height={104} />
            </div>
          ) : (
            <div style={{
              width: '80px',
              height: '104px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <BookOpen
                className="book-icon"
                style={{
                  width: '32px',
                  height: '32px',
                  color: 'var(--text-secondary)',
                  transition: 'color 0.3s ease',
                }}
              />
            </div>
          )}
        </div>

        {/* Book Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '8px',
              color: 'var(--text-primary)',
              transition: 'color 0.3s ease',
            }}
          >
            {book.title}
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}
          >
            by {book.authors ? book.authors.join(', ') : book.author}
          </p>

          {book.tag && (
            <span style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '11px',
              fontWeight: '500',
              color: colors.icon,
              backgroundColor: `${colors.icon}15`,
              padding: '4px 8px',
              borderRadius: '4px',
              width: 'fit-content'
            }}>
              {book.tag}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
