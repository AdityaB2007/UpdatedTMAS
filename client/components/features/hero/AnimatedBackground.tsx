'use client';

import React from 'react';

export default function AnimatedBackground() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1,
      pointerEvents: 'none'
    }}>
      {/* Animated gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(30, 30, 35, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(40, 40, 45, 0.5) 0%, transparent 50%)
          `,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {/* Floating orbs with animation */}
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
      </div>


      {/* CSS for animated orbs */}
      <style jsx>{`
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.25;
          animation: float 45s ease-in-out infinite;
          transform: translateZ(0);
          will-change: transform;
        }

        .gradient-orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(50, 50, 60, 0.6) 0%, transparent 70%);
          top: -150px;
          left: -100px;
          animation-delay: 0s;
          animation-duration: 50s;
        }

        .gradient-orb-2 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(60, 60, 70, 0.5) 0%, transparent 70%);
          bottom: -100px;
          right: -80px;
          animation-delay: -20s;
          animation-duration: 55s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1) translateZ(0);
          }
          25% {
            transform: translate(30px, -20px) scale(1.05) translateZ(0);
          }
          50% {
            transform: translate(-20px, 30px) scale(0.95) translateZ(0);
          }
          75% {
            transform: translate(25px, 15px) scale(1.02) translateZ(0);
          }
        }
      `}</style>
    </div>
  );
}
