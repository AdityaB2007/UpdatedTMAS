import PageLayout from '@/components/layout/PageLayout';

export default function Accessibility() {
  return (
    <PageLayout title="Accessibility Statement">
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        color: 'var(--text-secondary)',
        lineHeight: '1.8',
        fontSize: '1.125rem'
      }}>
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          fontStyle: 'italic'
        }}>
          Last Updated: November 24, 2025
        </p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Our Commitment to Accessibility
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            The Math and Science Academy (TMAS) is committed to ensuring digital accessibility for all users,
            including students with disabilities. We are continuously working to improve the accessibility and
            usability of our website and educational resources to ensure that everyone can access high-quality
            STEM education.
          </p>
          <p>
            We believe that education should be accessible to all, and we strive to meet or exceed the
            accessibility standards set forth in the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Accessibility Features
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Our website includes the following accessibility features:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Keyboard Navigation:</strong> All interactive
              elements can be accessed and operated using keyboard commands
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Screen Reader Compatibility:</strong> Our site
              is designed to work with popular screen readers including JAWS, NVDA, and VoiceOver
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Clear Navigation:</strong> Consistent and
              logical page structure with clear headings and landmarks
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Text Alternatives:</strong> Alternative text
              for images and visual content
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Color Contrast:</strong> Sufficient color
              contrast ratios for readability
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Resizable Text:</strong> Text can be resized
              up to 200% without loss of functionality
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Responsive Design:</strong> Mobile-friendly
              layout that adapts to different screen sizes and orientations
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Accessible Study Materials
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We are committed to making our educational resources accessible:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>PDF Accessibility:</strong> Our study guides
              are designed with accessibility in mind, including proper heading structure and searchable text
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Math Content:</strong> Mathematical equations
              and expressions are formatted for compatibility with assistive technologies
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Alternative Formats:</strong> We are working
              to provide alternative formats upon request for users who need them
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Clear Language:</strong> We use clear,
              concise language to make content easier to understand
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Known Limitations
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Despite our best efforts, some accessibility limitations may exist:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Some legacy PDF documents may not be fully accessible and are being updated
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Complex mathematical diagrams may require additional descriptive text
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Third-party embedded content (such as Discord widgets) may have their own accessibility limitations
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Some interactive features are still being optimized for full accessibility
            </li>
          </ul>
          <p>
            We are actively working to address these limitations and improve accessibility across all our
            materials.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Assistive Technologies Supported
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Our website is designed to be compatible with the following assistive technologies:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
            <li style={{ marginBottom: '0.5rem' }}>Screen magnification software</li>
            <li style={{ marginBottom: '0.5rem' }}>Speech recognition software</li>
            <li style={{ marginBottom: '0.5rem' }}>Alternative input devices</li>
            <li style={{ marginBottom: '0.5rem' }}>Browser accessibility features and extensions</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Ongoing Efforts
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We are committed to ongoing accessibility improvements:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Regular accessibility audits and testing with assistive technologies
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Training our team on accessibility best practices
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Incorporating accessibility into our development process
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Gathering feedback from users with disabilities
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Updating and improving existing content for better accessibility
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Feedback and Assistance
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We welcome your feedback on the accessibility of our website and educational resources. If you
            encounter any accessibility barriers or have suggestions for improvement, please let us know.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We aim to respond to accessibility feedback within 2 business days and to propose a solution within
            10 business days.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Request Accommodations
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            If you need materials in an alternative format or require specific accommodations to access our
            resources, we will work with you to provide reasonable accommodations. Please contact us with your
            specific needs, and we will do our best to assist you.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Contact Us About Accessibility
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            If you have questions, concerns, or need assistance regarding accessibility, please contact us:
          </p>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '1rem'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Email:</strong> accessibility@tmasacademy.org
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>General Contact:</strong> contact@tmasacademy.org
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Website:</strong> www.tmasacademy.org
            </p>
          </div>
          <p style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
            Please include "Accessibility" in your email subject line so we can prioritize your request.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Standards and Compliance
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We strive to conform to the following accessibility standards:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>WCAG 2.1 Level AA:</strong> Web Content
              Accessibility Guidelines from the W3C
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Section 508:</strong> U.S. federal accessibility
              requirements
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>ADA:</strong> Americans with Disabilities Act
              standards
            </li>
          </ul>
        </section>

        <section style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '3rem'
        }}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Our Promise:</strong>
          </p>
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>
            Accessibility is an ongoing journey, not a destination. We are committed to continually improving
            the accessibility of our website and resources to ensure that all students, regardless of ability,
            can access the high-quality STEM education they deserve.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
