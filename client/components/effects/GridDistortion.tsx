'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';

// Pages where the hover effect should be disabled
const DISABLED_PATHS = ['/chatbot', '/books', '/contact'];

export default function GridDistortion() {
  const pathname = usePathname();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const rafRef = useRef<number | null>(null);

  // Check if hover effect should be disabled on this page
  const isHoverDisabled = DISABLED_PATHS.includes(pathname);

  const cellSize = 50;
  const magnifyRadius = 100;

  // Set mounted state and viewport size
  useEffect(() => {
    setIsMounted(true);
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll position
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setScrollOffset({
        x: window.scrollX % cellSize,
        y: window.scrollY % cellSize
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isHoverDisabled) return;

    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY });
    });
  }, [isHoverDisabled]);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, isMounted]);

  // Generate grid lines using useMemo to avoid calling during SSR
  const visibleLines = useMemo(() => {
    if (!isMounted || viewportSize.width === 0) return [];

    const lines: { x: number; y: number; opacity: number }[] = [];
    const cols = Math.ceil(viewportSize.width / cellSize) + 2;
    const rows = Math.ceil(viewportSize.height / cellSize) + 2;

    // Adjust starting position based on scroll offset
    const startX = -scrollOffset.x;
    const startY = -scrollOffset.y;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;

        // Calculate distance from mouse
        const distance = Math.sqrt(
          Math.pow(x - mousePos.x, 2) +
          Math.pow(y - mousePos.y, 2)
        );

        if (distance <= magnifyRadius) {
          const normalizedDistance = distance / magnifyRadius;
          const opacity = 0.53 * Math.pow(1 - normalizedDistance, 2);
          if (opacity > 0.01) {
            lines.push({ x, y, opacity });
          }
        }
      }
    }
    return lines;
  }, [isMounted, viewportSize, scrollOffset, mousePos]);

  // Don't render anything until mounted (avoids SSR issues)
  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <pattern
            id="grid-pattern"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${-scrollOffset.x}, ${-scrollOffset.y})`}
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Base grid - moves with scroll */}
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Highlighted grid lines around cursor - aligned with scrolled grid */}
        {visibleLines.map((line, index) => (
          <path
            key={index}
            d={`M ${line.x + cellSize} ${line.y} L ${line.x} ${line.y} L ${line.x} ${line.y + cellSize}`}
            fill="none"
            stroke={`rgba(255, 255, 255, ${line.opacity})`}
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}
