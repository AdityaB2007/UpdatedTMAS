'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Book } from '@/data/books';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PdfCover to avoid SSR issues
const PdfCover = dynamic(() => import('./PdfCover'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '70px',
      height: '91px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <BookOpen style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
    </div>
  )
});

interface BookCarouselProps {
  books: Book[];
}

// Warm color palette
const warmColors = [
  { border: '#ef4444', hover: '#dc2626', bg: 'rgba(239, 68, 68, 0.03)', shadow: 'rgba(239, 68, 68, 0.15)', icon: '#ef4444' },
  { border: '#f97316', hover: '#ea580c', bg: 'rgba(249, 115, 22, 0.03)', shadow: 'rgba(249, 115, 22, 0.15)', icon: '#f97316' },
  { border: '#f59e0b', hover: '#d97706', bg: 'rgba(245, 158, 11, 0.03)', shadow: 'rgba(245, 158, 11, 0.15)', icon: '#f59e0b' },
  { border: '#eab308', hover: '#ca8a04', bg: 'rgba(234, 179, 8, 0.03)', shadow: 'rgba(234, 179, 8, 0.15)', icon: '#eab308' },
];

export default function BookCarousel({ books }: BookCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Duplicate books for seamless infinite scroll
  const duplicatedBooks = [...books, ...books, ...books];

  const cardWidth = 320;
  const gap = 24;
  const totalWidth = books.length * (cardWidth + gap);
  const scrollSpeed = 0.5; // pixels per frame at 60fps

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isPaused && scrollRef.current) {
        setScrollPosition(prev => {
          let newPos = prev + scrollSpeed * (delta / 16.67); // Normalize to 60fps
          // Reset when we've scrolled through one full set
          if (newPos >= totalWidth) {
            newPos = newPos - totalWidth;
          }
          return newPos;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, totalWidth]);

  // Calculate scale and opacity based on position from center
  const getCardStyle = (index: number): React.CSSProperties => {
    if (!containerRef.current) return {};

    const containerWidth = containerRef.current.offsetWidth;
    const centerX = containerWidth / 2;
    const cardPosition = index * (cardWidth + gap) - scrollPosition + cardWidth / 2;
    const distanceFromCenter = Math.abs(cardPosition - centerX);
    const maxDistance = containerWidth / 2 + cardWidth;

    // Calculate scale: 1 at center, 0.7 at edges
    const scale = Math.max(0.7, 1 - (distanceFromCenter / maxDistance) * 0.3);

    // Calculate opacity: 1 at center, 0.3 at edges
    const opacity = Math.max(0.3, 1 - (distanceFromCenter / maxDistance) * 0.7);

    return {
      transform: `scale(${scale})`,
      opacity,
      transition: isPaused ? 'transform 0.3s ease, opacity 0.3s ease' : 'none',
    };
  };

  const handleManualScroll = (direction: 'left' | 'right') => {
    const scrollAmount = cardWidth + gap;
    setScrollPosition(prev => {
      let newPos = direction === 'right' ? prev + scrollAmount : prev - scrollAmount;
      if (newPos < 0) newPos = totalWidth + newPos;
      if (newPos >= totalWidth) newPos = newPos - totalWidth;
      return newPos;
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '20px 0'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient overlays for fade effect */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)',
        zIndex: 10,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)',
        zIndex: 10,
        pointerEvents: 'none'
      }} />

      {/* Navigation arrows */}
      <button
        onClick={() => handleManualScroll('left')}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          transition: 'all 0.3s ease',
          opacity: isPaused ? 1 : 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.borderColor = 'var(--accent-yellow)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => handleManualScroll('right')}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          transition: 'all 0.3s ease',
          opacity: isPaused ? 1 : 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.borderColor = 'var(--accent-yellow)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel track */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: `${gap}px`,
          transform: `translateX(-${scrollPosition}px)`,
          willChange: 'transform'
        }}
      >
        {duplicatedBooks.map((book, index) => {
          const colors = warmColors[index % warmColors.length];
          const cardStyle = getCardStyle(index);
          const hasPdf = !!book.pdfPath;

          return (
            <div
              key={`${book.id}-${index}`}
              style={{
                flex: `0 0 ${cardWidth}px`,
                ...cardStyle
              }}
            >
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
                    height: '160px',
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
                        <PdfCover pdfPath={book.pdfPath!} width={70} height={91} />
                      </div>
                    ) : (
                      <div style={{
                        width: '70px',
                        height: '91px',
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
                            width: '28px',
                            height: '28px',
                            color: 'var(--text-secondary)',
                            transition: 'color 0.3s ease',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        marginBottom: '6px',
                        color: 'var(--text-primary)',
                        transition: 'color 0.3s ease',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const
                      }}
                    >
                      {book.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      by {book.authors ? book.authors.join(', ') : book.author}
                    </p>

                    {book.tag && (
                      <span style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        fontSize: '10px',
                        fontWeight: '500',
                        color: colors.icon,
                        backgroundColor: `${colors.icon}15`,
                        padding: '3px 6px',
                        borderRadius: '4px',
                        width: 'fit-content'
                      }}>
                        {book.tag}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
