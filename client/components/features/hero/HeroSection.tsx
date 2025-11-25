'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

export default function HeroSection() {
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/UKdzN7Ebsh';

  const scrollToContent = () => {
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      scrollSnapAlign: 'start'
    }}>
      <AnimatedBackground />

      <div style={{
        position: 'relative',
        zIndex: 20,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        padding: '0 24px'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          lineHeight: '1.1'
        }}>
          Free STEM Education for Everyone
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Master AP courses and competitive math with our comprehensive study guides
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/resources" style={{
            display: 'inline-block',
            padding: '16px 32px',
            backgroundColor: 'var(--accent-yellow)',
            color: 'var(--bg-primary)',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}>
            Explore Resources →
          </Link>

          <a href={discordUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block',
            padding: '16px 32px',
            border: '2px solid var(--accent-yellow)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}>
            Join Community
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToContent}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-yellow)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        aria-label="Scroll to content"
      >
        <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Scroll
        </span>
        <ChevronDown
          style={{
            width: '24px',
            height: '24px',
            animation: 'bounce 2s infinite'
          }}
        />
      </button>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </section>
  );
}
