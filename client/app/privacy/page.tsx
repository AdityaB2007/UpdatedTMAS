import PageLayout from '@/components/layout/PageLayout';

export default function PrivacyPolicy() {
  return (
    <PageLayout title="Privacy Policy">
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
            Introduction
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            The Math and Science Academy ("TMAS," "we," "us," or "our") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
            visit our website and use our educational resources.
          </p>
          <p>
            By accessing or using our services, you agree to this Privacy Policy. If you do not agree with the
            terms of this Privacy Policy, please do not access or use our services.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Information We Collect
          </h2>

          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            marginTop: '1.5rem'
          }}>
            Information You Provide
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We may collect information that you voluntarily provide to us when you:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Contact us via email or contact form</li>
            <li style={{ marginBottom: '0.5rem' }}>Subscribe to our newsletter or mailing list</li>
            <li style={{ marginBottom: '0.5rem' }}>Make a donation to support our mission</li>
            <li style={{ marginBottom: '0.5rem' }}>Join our Discord community</li>
            <li style={{ marginBottom: '0.5rem' }}>Participate in surveys or feedback forms</li>
          </ul>

          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            marginTop: '1.5rem'
          }}>
            Automatically Collected Information
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            When you visit our website, we may automatically collect certain information about your device,
            including:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>IP address and general location data</li>
            <li style={{ marginBottom: '0.5rem' }}>Browser type and version</li>
            <li style={{ marginBottom: '0.5rem' }}>Operating system</li>
            <li style={{ marginBottom: '0.5rem' }}>Pages visited and time spent on pages</li>
            <li style={{ marginBottom: '0.5rem' }}>Referring website addresses</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            How We Use Your Information
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We use the information we collect to:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Provide, operate, and maintain our educational resources</li>
            <li style={{ marginBottom: '0.5rem' }}>Improve and personalize your experience</li>
            <li style={{ marginBottom: '0.5rem' }}>Communicate with you about updates, resources, and announcements</li>
            <li style={{ marginBottom: '0.5rem' }}>Process donations and maintain donor records</li>
            <li style={{ marginBottom: '0.5rem' }}>Analyze usage patterns to improve our services</li>
            <li style={{ marginBottom: '0.5rem' }}>Respond to your inquiries and provide support</li>
            <li style={{ marginBottom: '0.5rem' }}>Comply with legal obligations and protect our rights</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Data Security
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We implement appropriate technical and organizational security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction. However, no method
            of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Third-Party Services
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Our website may contain links to third-party services, including:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Discord (for community discussions)</li>
            <li style={{ marginBottom: '0.5rem' }}>Payment processors (for donations)</li>
            <li style={{ marginBottom: '0.5rem' }}>Social media platforms</li>
          </ul>
          <p>
            These third-party services have their own privacy policies. We are not responsible for their
            practices and encourage you to review their privacy policies.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Children's Privacy
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Our services are intended for students of all ages. We do not knowingly collect personal information
            from children under 13 without parental consent. If you believe we have collected information from a
            child under 13, please contact us immediately so we can take appropriate action.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Your Rights
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            listStyleType: 'disc'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Access to your personal information</li>
            <li style={{ marginBottom: '0.5rem' }}>Correction of inaccurate information</li>
            <li style={{ marginBottom: '0.5rem' }}>Deletion of your personal information</li>
            <li style={{ marginBottom: '0.5rem' }}>Objection to processing of your information</li>
            <li style={{ marginBottom: '0.5rem' }}>Restriction of processing</li>
            <li style={{ marginBottom: '0.5rem' }}>Data portability</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Changes to This Privacy Policy
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review
            this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Contact Us
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Email:</strong> contact@tmasacademy.org
            </p>
            <p>
              <strong style={{ color: 'var(--text-primary)' }}>Website:</strong> www.tmasacademy.org
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
