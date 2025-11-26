'use client';

import PageLayout from '@/components/layout/PageLayout';
import { Heart, Users, BookOpen } from 'lucide-react';

export default function Donate() {
  return (
    <PageLayout
      title="Support Our Mission"
      subtitle="Your support helps us provide free, high-quality educational resources to students worldwide. TMAS is a nonprofit organization dedicated to making quality education accessible to everyone, completely free of charge."
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Impact Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <BookOpen
              style={{
                width: '48px',
                height: '48px',
                color: 'var(--accent-yellow)',
                margin: '0 auto 16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Free Resources
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              7 comprehensive study guides for AP courses, completely free
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <Users
              style={{
                width: '48px',
                height: '48px',
                color: 'var(--accent-yellow)',
                margin: '0 auto 16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Growing Community
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              500+ members in our Discord community supporting each other
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <Heart
              style={{
                width: '48px',
                height: '48px',
                color: 'var(--accent-yellow)',
                margin: '0 auto 16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Student-Led
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              Run entirely by passionate volunteers dedicated to education
            </p>
          </div>
        </div>

        {/* Donation CTA */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            Help Us Keep Education Free
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '24px'
          }}>
            Every contribution, no matter the size, helps us maintain and expand our free educational resources.
          </p>

          <div>
            <a
              href="https://buymeacoffee.com/tmasacademy"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--accent-yellow)',
                color: 'var(--bg-primary)',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-yellow)'}
            >
              Support Us on Buy Me A Coffee
            </a>

            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '16px'
            }}>
              Your contribution helps us maintain and expand our free educational resources
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>
            TMAS is a nonprofit organization. All resources are provided free of charge to students.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
