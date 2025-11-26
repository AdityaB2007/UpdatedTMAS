'use client';

import PageLayout from '@/components/layout/PageLayout';
import { UserPlus, Lightbulb, Globe, GraduationCap, Award, BookOpen } from 'lucide-react';

export default function Join() {
  const googleFormUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSfrabcJSdi3PbuoEaWwOf11Cj0R3iGDVabqUBjsp8zRxrswAg/viewform';

  return (
    <PageLayout
      title="Join the Team"
      subtitle="Want to make a difference in education? Join our passionate team of volunteers dedicated to providing free, high-quality learning resources to students worldwide."
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Benefits Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Lightbulb
              style={{
                width: '40px',
                height: '40px',
                color: '#fff800',
                marginBottom: '16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Make an Impact
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              Help thousands of students access quality educational resources they might not otherwise have
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <GraduationCap
              style={{
                width: '40px',
                height: '40px',
                color: '#f97316',
                marginBottom: '16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Gain Experience
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              Develop valuable skills in education, content creation, marketing, and nonprofit management
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Globe
              style={{
                width: '40px',
                height: '40px',
                color: '#ef4444',
                marginBottom: '16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Join a Community
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              Connect with like-minded individuals passionate about education and making a difference
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <UserPlus
              style={{
                width: '40px',
                height: '40px',
                color: '#f59e0b',
                marginBottom: '16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Flexible Commitment
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              Contribute on your own schedule with opportunities in content creation, outreach, and more
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Award
              style={{
                width: '40px',
                height: '40px',
                color: '#eab308',
                marginBottom: '16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Build Your Portfolio
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              Create published work and gain recognition for your contributions to educational accessibility
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <BookOpen
              style={{
                width: '40px',
                height: '40px',
                color: '#ffb800',
                marginBottom: '16px'
              }}
            />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Learn & Grow
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              Deepen your subject knowledge while teaching others and collaborating with experienced mentors
            </p>
          </div>
        </div>

        {/* Application Form Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Fill out our application form and we'll be in touch soon!
          </p>

          {/* Embedded Google Form */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <iframe
              src={googleFormUrl}
              width="100%"
              height="800"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              style={{ width: '100%' }}
            >
              Loading form...
            </iframe>
          </div>

          {/* Alternative Link */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              marginBottom: '12px'
            }}>
              Having trouble with the form above?
            </p>
            <a
              href={googleFormUrl}
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
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-yellow)'}
            >
              Open Form in New Tab
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>
            Questions? Reach out to us at{' '}
            <a
              href="mailto:tmasacademy@gmail.com"
              style={{
                color: 'var(--accent-yellow)',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#eab308'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-yellow)'}
            >
              tmasacademy@gmail.com
            </a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
