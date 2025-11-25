'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Book } from '@/data/books';
import BookCard from './BookCard';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BookGridProps {
  books: Book[];
  limit?: number;
}

export default function BookGrid({ books, limit }: BookGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Limit books if specified
  const displayedBooks = limit ? books.slice(0, limit) : books;

  useEffect(() => {
    if (typeof window === 'undefined' || !gridRef.current) return;

    // Clear previous refs
    cardsRef.current = cardsRef.current.slice(0, displayedBooks.length);

    // GSAP stagger animation
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, gridRef);

    return () => {
      ctx.revert();
    };
  }, [displayedBooks.length]);

  return (
    <div
      ref={gridRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}
    >
      {displayedBooks.map((book, index) => (
        <div
          key={book.id}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
        >
          <BookCard book={book} colorIndex={index} />
        </div>
      ))}
    </div>
  );
}
