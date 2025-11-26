'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import PageLayout from '@/components/layout/PageLayout';
import { allTeamMembers, departments, getTeamByDepartment, missionStatement, ourStory, TeamMember } from '@/data/team';
import { X, ChevronDown } from 'lucide-react';

export default function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [chevronVisible, setChevronVisible] = useState(true);
  const [chevronOpacity, setChevronOpacity] = useState(1);
  const teamHeadingRef = useRef<HTMLHeadingElement>(null);

  // Warm color palette for team cards
  const warmColors = [
    { border: '#ef4444', hover: '#dc2626', bg: 'rgba(239, 68, 68, 0.08)', shadow: 'rgba(239, 68, 68, 0.1)', role: '#ef4444' }, // red
    { border: '#f97316', hover: '#ea580c', bg: 'rgba(249, 115, 22, 0.08)', shadow: 'rgba(249, 115, 22, 0.1)', role: '#f97316' }, // orange
    { border: '#f59e0b', hover: '#d97706', bg: 'rgba(245, 158, 11, 0.08)', shadow: 'rgba(245, 158, 11, 0.1)', role: '#f59e0b' }, // amber
    { border: '#eab308', hover: '#ca8a04', bg: 'rgba(234, 179, 8, 0.08)', shadow: 'rgba(234, 179, 8, 0.1)', role: '#eab308' }, // yellow
  ];

  const closeModal = () => setSelectedMember(null);

  // Show chevron only when above the team heading, hide when heading reaches target position
  useEffect(() => {
    const handleScroll = () => {
      if (!teamHeadingRef.current) return;

      const headingRect = teamHeadingRef.current.getBoundingClientRect();
      // This should match the headerOffset in scrollToTeam (120px)
      const targetPosition = 120;
      // Start fading when heading is within 200px of target
      const fadeStartDistance = 200;

      // headingRect.top is the distance from viewport top to the heading
      // When heading is at target position, headingRect.top = 120

      if (headingRect.top > targetPosition + fadeStartDistance) {
        // Heading is far below target - show chevron fully
        setChevronOpacity(1);
        setChevronVisible(true);
      } else if (headingRect.top > targetPosition) {
        // Heading is approaching target - fade out
        const fadeProgress = (headingRect.top - targetPosition) / fadeStartDistance;
        setChevronOpacity(Math.max(0, fadeProgress));
        setChevronVisible(true);
      } else {
        // Heading has reached or passed target - hide immediately
        setChevronOpacity(0);
        setChevronVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTeam = () => {
    const teamHeading = teamHeadingRef.current;
    if (teamHeading) {
      // Get the heading position and account for navbar height (about 80px) + 20px extra space
      const headerOffset = 120;
      const elementPosition = teamHeading.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <PageLayout title="About TMAS Academy">
      {/* Hero Section - YouTube Thumbnails and Intro */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* YouTube Thumbnails Image */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <Image
              src="/youtube-thumbnails.png"
              alt="TMAS Academy YouTube video thumbnails showcasing educational content"
              width={800}
              height={600}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
              priority
            />
          </div>

          {/* Intro Text */}
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Empowering Students Through Free Education
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.75',
              marginBottom: '20px'
            }}>
              TMAS Academy is a non-profit organization dedicated to providing high-quality,
              free educational resources to students worldwide. Through our comprehensive study
              guides, video content, and supportive community, we're breaking down barriers to
              academic excellence.
            </p>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.75'
            }}>
              Join our community of 500+ students on Discord and access our complete library
              of AP exam preparation materials, competitive mathematics resources, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section - Text on Left, Image on Right */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Mission Text */}
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid var(--accent-yellow)',
              textAlign: 'left'
            }}>
              Our Mission
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.75',
              textAlign: 'left'
            }}>
              {missionStatement}
            </p>
          </div>

          {/* Mission Image */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'var(--bg-secondary)',
            position: 'relative',
            aspectRatio: '4/3'
          }}>
            <Image
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
              alt="Students collaborating and studying together"
              fill
              style={{
                objectFit: 'cover'
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Story Section - Image on Left, Text on Right */}
      <section style={{ marginBottom: '80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Story Image */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'var(--bg-secondary)',
            position: 'relative',
            aspectRatio: '4/3'
          }}>
            <Image
              src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop"
              alt="Educational resources including books and learning materials"
              fill
              style={{
                objectFit: 'cover'
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Story Text */}
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid var(--accent-yellow)',
              textAlign: 'left'
            }}>
              Our Story
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.75',
              textAlign: 'left'
            }}>
              {ourStory}
            </p>
          </div>
        </div>
      </section>

      {/* Fixed Scroll Down Indicator - Shows until team heading is visible */}
      {chevronVisible && (
        <button
          onClick={scrollToTeam}
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(14, 20, 20, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '30px',
            padding: '12px 24px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--text-secondary)',
            transition: 'all 0.3s ease',
            zIndex: 50,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            opacity: chevronOpacity
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-yellow)';
            e.currentTarget.style.borderColor = 'var(--accent-yellow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
          aria-label="Scroll to team"
        >
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Meet The Team
          </span>
          <ChevronDown
            style={{
              width: '20px',
              height: '20px',
              animation: 'bounce 2s infinite'
            }}
          />
        </button>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
          60% {
            transform: translateY(-3px);
          }
        }
      `}</style>

      {/* Team Section - Grouped by Department */}
      <section id="team-section">
        <h2
          ref={teamHeadingRef}
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          Meet Our Team
        </h2>

        {(() => {
          let globalIndex = 0;

          // Define row layouts for specific departments
          // Each number represents how many people in that row
          const getRowLayout = (department: string, count: number): number[] => {
            if (department === "Academic Writing" && count === 12) {
              return [6, 6]; // 2 rows of 6
            }
            if (department === "Marketing" && count === 17) {
              return [5, 6, 6]; // 3 rows: 5, 6, 6
            }
            // Default: all in rows of the count or standard layout
            if (count <= 6) return [count];
            if (count % 6 === 0) {
              return Array(count / 6).fill(6);
            }
            // Fallback
            const rows: number[] = [];
            let remaining = count;
            while (remaining > 0) {
              const rowSize = Math.min(6, remaining);
              rows.push(rowSize);
              remaining -= rowSize;
            }
            return rows;
          };

          const maxRowWidth = 1000; // Fixed width for all rows
          const gap = 20;

          return departments.map((department) => {
            const members = getTeamByDepartment(department);
            if (members.length === 0) return null;

            const isLeadership = department === "Leadership";
            const rowLayout = getRowLayout(department, members.length);

            // For leadership, use a different layout
            if (isLeadership) {
              const cardWidth = 400;
              return (
                <div key={department} style={{ marginBottom: '64px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--accent-yellow)',
                    textAlign: 'center',
                    marginBottom: '32px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid rgba(255, 193, 7, 0.3)',
                    maxWidth: '300px',
                    margin: '0 auto 32px'
                  }}>
                    {department}
                  </h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    {members.map((member) => {
                      const memberColors = warmColors[globalIndex % warmColors.length];
                      globalIndex++;
                      return (
                        <div key={member.id} style={{ width: `${cardWidth}px` }}>
                          <TeamCard
                            member={member}
                            onClick={() => setSelectedMember(member)}
                            colors={memberColors}
                            isLeader={true}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // For other departments, render rows with variable card widths
            let memberIndex = 0;
            const rows = rowLayout.map((rowCount, rowIdx) => {
              const rowMembers = members.slice(memberIndex, memberIndex + rowCount);
              memberIndex += rowCount;
              // Calculate card width: (total width - gaps) / number of cards
              const cardWidth = (maxRowWidth - (rowCount - 1) * gap) / rowCount;

              return (
                <div
                  key={rowIdx}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: `${gap}px`,
                    width: `${maxRowWidth}px`,
                    margin: '0 auto',
                    marginBottom: rowIdx < rowLayout.length - 1 ? `${gap}px` : '0'
                  }}
                >
                  {rowMembers.map((member) => {
                    const memberColors = warmColors[globalIndex % warmColors.length];
                    globalIndex++;
                    return (
                      <div key={member.id} style={{
                        width: `${cardWidth}px`,
                        height: '180px'
                      }}>
                        <TeamCard
                          member={member}
                          onClick={() => setSelectedMember(member)}
                          colors={memberColors}
                          isLeader={false}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            });

            return (
              <div key={department} style={{ marginBottom: '64px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--accent-yellow)',
                  textAlign: 'center',
                  marginBottom: '32px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid rgba(255, 193, 7, 0.3)',
                  maxWidth: '300px',
                  margin: '0 auto 32px'
                }}>
                  {department}
                </h3>
                {rows}
              </div>
            );
          });
        })()}
      </section>

      {/* Modal for Team Member Details */}
      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={closeModal} />
      )}
    </PageLayout>
  );
}

// Team Card Component with hover animations
function TeamCard({
  member,
  onClick,
  colors,
  isLeader = false
}: {
  member: TeamMember;
  onClick: () => void;
  colors: { border: string; hover: string; bg: string; shadow: string; role: string };
  isLeader?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? colors.bg : 'var(--bg-secondary)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: isLeader ? '32px' : '16px',
        textAlign: 'center',
        border: isHovered ? `1px solid ${colors.border}` : '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px ${colors.shadow}`
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {/* Photo */}
      <div style={{
        width: isLeader ? '150px' : '80px',
        height: isLeader ? '150px' : '80px',
        margin: '0 auto 12px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: isHovered ? `3px solid ${colors.border}` : '3px solid rgba(255, 255, 255, 0.2)',
        transition: 'border-color 0.3s ease',
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flexShrink: 0
      }}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes={isLeader ? '150px' : '80px'}
        />
      </div>

      {/* Name */}
      <h3 style={{
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '4px',
        fontSize: isLeader ? '1.25rem' : '0.85rem',
        transition: 'color 0.3s ease',
        lineHeight: '1.2'
      }}>
        {member.name}
      </h3>

      {/* Role */}
      <p style={{
        fontSize: isLeader ? '1rem' : '0.75rem',
        color: isHovered ? colors.role : 'var(--text-secondary)',
        transition: 'color 0.3s ease',
        marginBottom: isLeader ? '8px' : '4px',
        lineHeight: '1.2'
      }}>
        {member.role}
      </p>

      {/* School (if available) - only show for leader */}
      {isLeader && member.school && (
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-tertiary)',
          fontStyle: 'italic'
        }}>
          {member.school}
        </p>
      )}

      {/* Click indicator - only for leader card */}
      {isLeader && (
        <div style={{
          marginTop: '12px',
          fontSize: '0.7rem',
          color: isHovered ? colors.role : 'transparent',
          transition: 'color 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Click to learn more
        </div>
      )}
    </div>
  );
}

// Modal Component for Team Member Details
function TeamMemberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
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
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s ease'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <X size={20} />
        </button>

        {/* Photo */}
        <div style={{
          width: '150px',
          height: '150px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid var(--accent-yellow)',
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <Image
            src={member.image}
            alt={member.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="150px"
          />
        </div>

        {/* Name */}
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          {member.name}
        </h2>

        {/* Role */}
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--accent-yellow)',
          textAlign: 'center',
          marginBottom: '8px',
          fontWeight: '500'
        }}>
          {member.role}
        </p>

        {/* School */}
        {member.school && (
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '16px',
            fontStyle: 'italic'
          }}>
            {member.school}
          </p>
        )}

        {/* Department Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <span style={{
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            color: 'var(--accent-yellow)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}>
            {member.department}
          </span>
        </div>

        {/* Bio */}
        {member.bio && (
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            textAlign: 'center'
          }}>
            {member.bio}
          </p>
        )}
      </div>

      {/* CSS Animations */}
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
    </div>
  );
}
