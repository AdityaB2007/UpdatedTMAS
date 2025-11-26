'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { testimonials } from '@/data/testimonials';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const isAnimating = useRef(false);
  const previousIndexRef = useRef(0);

  const cardWidth = 358; // Width of each card (334px) + gap (24px)
  const totalCards = testimonials.length;
  const AUTO_SCROLL_DELAY = 4500; // 4.5 seconds for consistent timing
  const ANIMATION_DURATION = 0.8; // GSAP animation duration in seconds

  // Create duplicated array for infinite loop effect
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Warm color palette for rotating testimonials
  const warmColors = [
    { border: '#ef4444', hover: '#dc2626', bg: 'rgba(239, 68, 68, 0.02)', shadow: 'rgba(239, 68, 68, 0.1)' }, // red
    { border: '#f97316', hover: '#ea580c', bg: 'rgba(249, 115, 22, 0.02)', shadow: 'rgba(249, 115, 22, 0.1)' }, // orange
    { border: '#f59e0b', hover: '#d97706', bg: 'rgba(245, 158, 11, 0.02)', shadow: 'rgba(245, 158, 11, 0.1)' }, // amber
    { border: '#eab308', hover: '#ca8a04', bg: 'rgba(234, 179, 8, 0.02)', shadow: 'rgba(234, 179, 8, 0.1)' }, // yellow
  ];

  const getColorForIndex = (idx: number) => {
    return warmColors[idx % warmColors.length];
  };

  // Centralized function to start/restart auto-scroll
  const startAutoScroll = useCallback(() => {
    // Clear any existing interval
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }

    // Don't start if paused
    if (isPaused) return;

    // Create new interval
    autoScrollInterval.current = setInterval(() => {
      if (!isAnimating.current) {
        setCurrentIndex((prev) => (prev + 1) % totalCards);
      }
    }, AUTO_SCROLL_DELAY);
  }, [totalCards, isPaused]);

  // Stop auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  // Reset auto-scroll (stop and restart)
  const resetAutoScroll = useCallback(() => {
    stopAutoScroll();
    startAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  // Initialize slider position on mount
  useEffect(() => {
    if (!sliderRef.current) return;

    // Start at the middle set to enable infinite scrolling in both directions
    const startPosition = -totalCards * cardWidth;
    gsap.set(sliderRef.current, { x: startPosition });
  }, [totalCards, cardWidth]);

  // Handle auto-scroll lifecycle
  useEffect(() => {
    startAutoScroll();

    return () => {
      stopAutoScroll();
    };
  }, [startAutoScroll, stopAutoScroll]);

  // Animate to a specific index whenever currentIndex changes
  useEffect(() => {
    if (!sliderRef.current) return;

    isAnimating.current = true;

    const basePosition = -totalCards * cardWidth;
    const targetX = basePosition - (currentIndex * cardWidth);

    // Detect if we're wrapping from last to first
    const isWrappingForward = currentIndex === 0 && previousIndexRef.current === totalCards - 1;
    previousIndexRef.current = currentIndex;

    if (isWrappingForward) {
      // Animate to the third set's first card for smooth transition
      const wrapTargetX = basePosition - (totalCards * cardWidth);
      gsap.to(sliderRef.current, {
        x: wrapTargetX,
        duration: ANIMATION_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          // Instantly reset to middle set's first card (invisible jump)
          if (sliderRef.current) {
            gsap.set(sliderRef.current, { x: basePosition });
          }
          isAnimating.current = false;
        },
      });
    } else {
      // Normal animation
      gsap.to(sliderRef.current, {
        x: targetX,
        duration: ANIMATION_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    }
  }, [currentIndex, totalCards, cardWidth]);

  const goToSlide = (index: number) => {
    if (isAnimating.current || index === currentIndex) return;

    setCurrentIndex(index);
    resetAutoScroll();
  };

  const handlePrevious = () => {
    if (isAnimating.current) return;

    const newIndex = currentIndex === 0 ? totalCards - 1 : currentIndex - 1;

    if (!sliderRef.current) return;

    isAnimating.current = true;
    const basePosition = -totalCards * cardWidth;

    if (currentIndex === 0) {
      // Going from first to last - animate backwards to previous set
      const wrapTargetX = basePosition + cardWidth;
      gsap.to(sliderRef.current, {
        x: wrapTargetX,
        duration: ANIMATION_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          // Reset to middle set's last card
          if (sliderRef.current) {
            gsap.set(sliderRef.current, { x: basePosition - ((totalCards - 1) * cardWidth) });
          }
          isAnimating.current = false;
        },
      });
    } else {
      // Normal backward animation
      gsap.to(sliderRef.current, {
        x: basePosition - (newIndex * cardWidth),
        duration: ANIMATION_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    }

    setCurrentIndex(newIndex);
    resetAutoScroll();
  };

  const handleNext = () => {
    if (isAnimating.current) return;

    const newIndex = (currentIndex + 1) % totalCards;
    setCurrentIndex(newIndex);
    resetAutoScroll();
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startAutoScroll();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider Container */}
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          minHeight: '220px',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            gap: '24px',
            willChange: 'transform',
          }}
        >
          {duplicatedTestimonials.map((testimonial, idx) => {
            const colors = getColorForIndex(idx);
            return (
            <div
              key={`${testimonial.id}-${idx}`}
              style={{
                flexShrink: 0,
                width: '334px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  minHeight: '180px',
                  padding: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--glass-border)',
                  borderLeft: `3px solid ${colors.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeftColor = colors.hover;
                  e.currentTarget.style.backgroundColor = colors.bg;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.shadow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeftColor = colors.border;
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Quote */}
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    color: 'var(--text-secondary)',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author Info */}
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      marginBottom: '4px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '32px',
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={isAnimating.current}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            cursor: isAnimating.current ? 'not-allowed' : 'pointer',
            opacity: isAnimating.current ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isAnimating.current) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 248, 0, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent-yellow)';
              e.currentTarget.style.color = 'var(--accent-yellow)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          aria-label="Previous testimonial"
        >
          <ChevronLeft style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Dot Indicators */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {testimonials.map((_, index) => {
            const colors = getColorForIndex(index);
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating.current}
                style={{
                  height: '4px',
                  width: index === currentIndex ? '32px' : '8px',
                  borderRadius: '9999px',
                  backgroundColor: index === currentIndex
                    ? colors.border
                    : 'var(--glass-border)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: isAnimating.current ? 'not-allowed' : 'pointer',
                  opacity: isAnimating.current ? 0.5 : 1,
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={isAnimating.current}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            cursor: isAnimating.current ? 'not-allowed' : 'pointer',
            opacity: isAnimating.current ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isAnimating.current) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 248, 0, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent-yellow)';
              e.currentTarget.style.color = 'var(--accent-yellow)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          aria-label="Next testimonial"
        >
          <ChevronRight style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    </div>
  );
}
