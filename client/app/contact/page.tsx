'use client';

import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Mail, Send, X } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageLayout
      title="Get in Touch"
      subtitle="Have questions or want to learn more? We'd love to hear from you."
    >
      {/* Coming Soon Popup */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Mail style={{ width: '28px', height: '28px', color: '#f97316' }} />
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              Coming Soon!
            </h3>

            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Our contact form is under construction. Please reach out via email or our social media channels for now.
            </p>

            <a
              href="mailto:weexploremath@gmail.com"
              style={{
                display: 'inline-block',
                backgroundColor: '#f97316',
                color: 'white',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ea580c';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Email Us Instead
            </a>
          </div>
        </div>
      )}

      {/* Popup animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Contact Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f97316';
                e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ef4444';
                e.target.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="message"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Tell us what's on your mind..."
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                resize: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f59e0b';
                e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#fff800',
              color: 'var(--bg-primary)',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eab308';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 248, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff800';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Mail className="w-8 h-8 text-yellow-500 mx-auto mb-3" style={{ color: 'var(--accent-yellow)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Or reach out directly at:</p>
            <a
              href="mailto:weexploremath@gmail.com"
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--accent-yellow)',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#eab308'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-yellow)'}
            >
              weexploremath@gmail.com
            </a>
          </div>

          {/* Social Media Links */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px'
          }}>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '16px' }}>Connect with us:</p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px'
            }}>
              <a
                href="https://discord.gg/cANVuvFn3x"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-yellow)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Discord
              </a>
              <a
                href="https://www.instagram.com/tmasacademy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-yellow)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/tmas-academy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-yellow)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
