'use client';

import React, { useEffect } from 'react';
import StatsGrid from '@/components/features/stats/StatsGrid';
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider';
import HeroSection from '@/components/features/hero/HeroSection';
import BookGrid from '@/components/features/books/BookGrid';
import { books } from '@/data/books';

export default function HomePage() {
  useEffect(() => {
    // Add scroll snap behavior on slight scroll from hero
    let hasScrolled = false;

    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // If at top of page and scrolling down, snap to content
      if (scrollY < heroHeight * 0.1 && e.deltaY > 0 && !hasScrolled) {
        hasScrolled = true;
        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
          statsSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Reset after animation completes
        setTimeout(() => {
          hasScrolled = false;
        }, 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Grid Section */}
      <div id="stats-section">
        <StatsGrid />
      </div>

      {/* Our Resources Section */}
      <section style={{
        padding: '80px 24px',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '16px'
            }}>
              Study Guides
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Free, comprehensive study guides for AP courses and competitive math
            </p>
          </div>

          {/* Book Grid - First 3 Books */}
          <BookGrid books={books} limit={3} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        padding: '80px 24px 120px',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '16px'
            }}>
              What Students Say
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Hear from students who have used our resources
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>
    </div>
  );
}
