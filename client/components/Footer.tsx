'use client';

import Link from 'next/link';
import { Youtube, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <style jsx global>{`
        .footer-social-link {
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }
        .footer-social-link.youtube:hover {
          color: #ef4444;
        }
        .footer-social-link.linkedin:hover {
          color: #3b82f6;
        }
        .footer-social-link.instagram:hover {
          color: #ec4899;
        }
        .footer-nav-link {
          font-size: 14px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .footer-nav-link:hover {
          color: var(--accent-yellow);
        }
      `}</style>

      <footer
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--glass-border)',
          color: 'var(--text-primary)',
          paddingTop: '64px',
          paddingBottom: '48px',
          marginTop: '0'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            {/* About Section */}
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  color: 'var(--text-primary)'
                }}
              >
                TMAS Academy
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  marginBottom: '24px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}
              >
                Making education accessible to everyone. Free, high-quality math and science resources for students.
              </p>
              {/* Social Links */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <a
                  href="https://www.youtube.com/@tmasacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link youtube"
                  aria-label="YouTube"
                >
                  <Youtube style={{ width: '24px', height: '24px' }} />
                </a>
                <a
                  href="https://www.linkedin.com/company/tmas-academy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link linkedin"
                  aria-label="LinkedIn"
                >
                  <Linkedin style={{ width: '24px', height: '24px' }} />
                </a>
                <a
                  href="https://www.instagram.com/tmasacademy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link instagram"
                  aria-label="Instagram"
                >
                  <Instagram style={{ width: '24px', height: '24px' }} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  color: 'var(--text-primary)'
                }}
              >
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'About' },
                  { href: '/resources', label: 'Resources' },
                  { href: '/books', label: 'Books' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/donate', label: 'Donate' },
                  { href: '/join', label: 'Join' }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="footer-nav-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  color: 'var(--text-primary)'
                }}
              >
                Legal
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                  { href: '/accessibility', label: 'Accessibility' }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="footer-nav-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            style={{
              paddingTop: '32px',
              textAlign: 'center',
              borderTop: '1px solid var(--glass-border)'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-tertiary)'
              }}
            >
              © 2025 TMAS Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
