'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, MessageCircle } from 'lucide-react';
import MobileMenu from './MobileMenu';

// Logo Component - Uses image file from /public/tmas-logo.png with text fallback
function Logo() {
  const [imageError, setImageError] = useState(false);
  const logoImagePath = '/tmas-logo.png';

  // If image fails to load, show text fallback
  if (imageError) {
    return (
      <Link
        href="/"
        className="logo-link"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
          gap: '2px'
        }}
      >
        <span style={{
          fontSize: '28px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #fff800 0%, #ffb800 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '1px'
        }}>
          πMΔ∫
        </span>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #fff800 0%, #ffb800 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px',
          marginTop: '-4px'
        }}>
          ACADEMY
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="logo-link"
      style={{
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <Image
        src={logoImagePath}
        alt="TMAS Academy Logo"
        width={110}
        height={48}
        priority
        style={{
          transition: 'all 0.3s ease',
          objectFit: 'contain',
        }}
        onError={() => setImageError(true)}
      />
    </Link>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/resources', label: 'Resources' },
    { href: '/books', label: 'Books' },
    { href: '/contact', label: 'Contact' },
    { href: '/donate', label: 'Donate' },
    { href: '/join', label: 'Join' },
    { href: '/chatbot', label: 'Chatbot', isSpecial: true },
  ];

  return (
    <>
      <style jsx global>{`
        .nav-link {
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          position: relative;
          padding: 8px 0;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }
        .nav-link:not(.donate-link) {
          color: rgba(255, 255, 255, 0.8);
        }
        .nav-link:not(.donate-link):hover {
          color: #ffffff;
        }
        .donate-link {
          color: #FCD34D;
        }
        .donate-link:hover {
          color: #F59E0B;
          text-shadow: 0 0 20px rgba(252, 211, 77, 0.5);
        }
        .nav-link .nav-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-link:not(.donate-link) .nav-underline {
          background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.6) 100%);
        }
        .donate-link .nav-underline {
          background: linear-gradient(90deg, #FCD34D 0%, #F59E0B 100%);
        }
        .nav-link:hover .nav-underline {
          width: 100%;
        }
        .logo-link {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #fff800 0%, #ffb800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          letter-spacing: -0.5px;
        }
        .logo-link:hover {
          background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }
        /* Logo image hover effect */
        .logo-link:hover img {
          filter: brightness(1.1);
          transform: scale(1.02);
        }
        .mobile-menu-btn {
          display: none;
          padding: 8px;
          color: rgba(255, 255, 255, 0.8);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
        }
        .mobile-menu-btn:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: block;
          }
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(20, 25, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 248, 0, 0.2)',
          padding: '16px 0',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '48px' }}>
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${link.label === 'Donate' ? 'donate-link' : ''}`}
                  style={{ gap: link.isSpecial ? '6px' : '0' }}
                >
                  {link.isSpecial && <MessageCircle size={16} />}
                  {link.label}
                  <span className="nav-underline" />
                </Link>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X style={{ width: '24px', height: '24px' }} />
              ) : (
                <Menu style={{ width: '24px', height: '24px' }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}
