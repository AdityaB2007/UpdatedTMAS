'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  isSpecial?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s ease'
        }}
        className="lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: 0,
          height: 'calc(100vh - 80px)',
          width: '280px',
          zIndex: 50,
          backgroundColor: 'rgba(14, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)'
        }}
        className="lg:hidden"
      >
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '24px', gap: '8px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: link.label === 'Donate' ? '#FCD34D' : 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '14px 16px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: link.isSpecial ? '8px' : '0',
                backgroundColor: 'transparent',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (link.label === 'Donate') {
                  e.currentTarget.style.backgroundColor = 'rgba(252, 211, 77, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(252, 211, 77, 0.3)';
                  e.currentTarget.style.color = '#F59E0B';
                  e.currentTarget.style.textShadow = '0 0 20px rgba(252, 211, 77, 0.5)';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                if (link.label === 'Donate') {
                  e.currentTarget.style.color = '#FCD34D';
                  e.currentTarget.style.textShadow = 'none';
                } else {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
              {link.isSpecial && <MessageCircle size={18} />}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
