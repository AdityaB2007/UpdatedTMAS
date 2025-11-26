'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  accentColor: string;
  hoverBg: string;
  shadowColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, suffix = '', label, accentColor, hoverBg, shadowColor }) => {
  const countRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const countElement = countRef.current;
    const cardElement = cardRef.current;

    if (!countElement || !cardElement) return;

    // Create counter animation
    const counter = { value: 0 };

    // Card fade in and slide up animation
    gsap.fromTo(
      cardElement,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardElement,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
        },
      }
    );

    // Counter animation with ScrollTrigger
    gsap.to(counter, {
      value: value,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardElement,
        start: 'top bottom-=100',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        const displayValue = Math.floor(counter.value);
        countElement.textContent = `${displayValue}${suffix}`;
      },
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === cardElement) {
          trigger.kill();
        }
      });
    };
  }, [value, suffix]);

  return (
    <div
      ref={cardRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px',
        border: '1px solid var(--glass-border)',
        borderTop: `3px solid ${accentColor}`,
        borderRadius: '12px',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative',
        zIndex: 2,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBg;
        e.currentTarget.style.borderColor = accentColor;
        e.currentTarget.style.borderTopWidth = '3px';
        e.currentTarget.style.boxShadow = `0 8px 30px ${shadowColor}`;
        e.currentTarget.style.transform = 'translateY(-4px)';
        const countElem = e.currentTarget.querySelector('.stat-count') as HTMLElement;
        if (countElem) countElem.style.color = accentColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.borderTopColor = accentColor;
        e.currentTarget.style.borderTopWidth = '3px';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        const countElem = e.currentTarget.querySelector('.stat-count') as HTMLElement;
        if (countElem) countElem.style.color = 'var(--text-primary)';
      }}
    >
      <div
        ref={countRef}
        className="stat-count"
        style={{
          fontSize: 'clamp(2.25rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          transition: 'color 0.3s ease',
        }}
      >
        0{suffix}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default function StatsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    // Stagger animation for all cards
    const cards = gridElement.querySelectorAll('.stat-card');

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridElement,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
        },
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === gridElement) {
          trigger.kill();
        }
      });
    };
  }, []);

  const stats = [
    {
      value: 10,
      suffix: '+',
      label: 'Study Guides',
      accentColor: '#ef4444', // red
      hoverBg: 'rgba(239, 68, 68, 0.03)',
      shadowColor: 'rgba(239, 68, 68, 0.2)',
    },
    {
      value: 1000,
      suffix: '+',
      label: 'Practice Problems',
      accentColor: '#f97316', // orange
      hoverBg: 'rgba(249, 115, 22, 0.03)',
      shadowColor: 'rgba(249, 115, 22, 0.2)',
    },
    {
      value: 500,
      suffix: '+',
      label: 'Active Students',
      accentColor: '#f59e0b', // amber
      hoverBg: 'rgba(245, 158, 11, 0.03)',
      shadowColor: 'rgba(245, 158, 11, 0.2)',
    },
    {
      value: 2021,
      suffix: '',
      label: 'Founded',
      accentColor: '#eab308', // yellow
      hoverBg: 'rgba(234, 179, 8, 0.03)',
      shadowColor: 'rgba(234, 179, 8, 0.2)',
    },
  ];

  return (
    <section
      style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        maxWidth: '1152px',
        margin: '0 auto',
      }}
    >
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
        }}
      >
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <StatCard
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              accentColor={stat.accentColor}
              hoverBg={stat.hoverBg}
              shadowColor={stat.shadowColor}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
