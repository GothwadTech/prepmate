import React from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <div
      className="app-container"
      id="privacy-policy-page"
      style={{
        minHeight: '100vh',
        backgroundColor: '#202124',
        color: '#E8EAED',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Google-style Clean App Header */}
      <header
        className="app-header"
        id="privacy-page-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '54px',
          backgroundColor: '#202124',
          borderBottom: '1px solid #3C4043',
          borderBottomLeftRadius: '18px',
          borderBottomRightRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          id="privacy-back-btn"
          aria-label="Go back"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#303134',
            border: '1px solid #3C4043',
            color: '#E8EAED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3C4043';
            e.currentTarget.style.color = '#0494F4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#303134';
            e.currentTarget.style.color = '#E8EAED';
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <h1
          style={{
            fontSize: '17px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.2px',
          }}
        >
          Privacy Policy
        </h1>

        {/* Empty placeholder for symmetrical optical balance */}
        <div style={{ width: '38px' }} />
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: '20px 16px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          lineHeight: 1.6,
        }}
      >
        {/* Banner Card */}
        <div
          style={{
            backgroundColor: '#303134',
            border: '1px solid #3C4043',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(15, 157, 88, 0.16)',
              color: '#81C995',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
              Prepmate Privacy & Data Protection
            </div>
            <div style={{ fontSize: '12px', color: '#9AA0A6', marginTop: '2px' }}>
              Managed by{' '}
              <a
                href="https://gothwadtech.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0494F4', fontWeight: 600, textDecoration: 'none' }}
              >
                Gothwad Tech
              </a>{' '}
              • Last updated: 2026
            </div>
          </div>
        </div>

        {/* Section 1: Overview */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            1. Our Commitment to Student Privacy
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            At <strong style={{ color: '#0494F4' }}>Prepmate</strong>, engineered by{' '}
            <strong style={{ color: '#FFFFFF' }}>Gothwad Tech</strong>, we respect your privacy and are committed to
            protecting your personal and academic study data. This Privacy Policy details how we collect, store, and
            safeguard your information.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            2. Information We Collect
          </h2>
          <ul style={{ fontSize: '13px', color: '#BDC1C6', margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong style={{ color: '#FFFFFF' }}>Account Credentials:</strong> Name, unique username, email address,
              and encrypted credentials.
            </li>
            <li>
              <strong style={{ color: '#FFFFFF' }}>NEET Exam Targets:</strong> Target examination year (e.g. 2026, 2027)
              and target score (e.g. 680+/720) used solely for pacing calculators.
            </li>
            <li>
              <strong style={{ color: '#FFFFFF' }}>Study Progress & Analytics:</strong> Daily completed tasks, revision
              timers, topic completion checkboxes (Physics, Chemistry, Biology), and consistency streaks.
            </li>
            <li>
              <strong style={{ color: '#FFFFFF' }}>Accountability Data:</strong> Connected study buddies, mutual challenge
              milestones, and leaderboard participation.
            </li>
          </ul>
        </section>

        {/* Section 3: How We Use Data */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            3. How We Use Your Information
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: '0 0 8px 0' }}>
            Your information is used strictly to power your study experience:
          </p>
          <ul style={{ fontSize: '13px', color: '#BDC1C6', margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Real-time sync between your devices and offline-first local storage.</li>
            <li>Generating personal study analytics, consistency scores, and streak heatmaps.</li>
            <li>Displaying accountability statistics to your approved study partners.</li>
            <li>Delivering local countdown reminders and study notifications.</li>
          </ul>
        </section>

        {/* Section 4: Zero Advertising / No Selling of Data */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            4. Strict No-Sell Policy
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            Gothwad Tech <strong style={{ color: '#81C995' }}>never sells, rents, or monetizes</strong> your personal or
            academic study data to third-party advertisers, coaching institutes, or data brokers. Your focus remains 100% on
            cracking NEET without intrusive targeted ads.
          </p>
        </section>

        {/* Section 5: Offline Cache & Storage */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            5. Storage & Cloud Security
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            We implement industry-standard encryption in transit (HTTPS/TLS) and use secure Google Cloud infrastructure for
            cloud storage. Prepmate also employs client-side IndexedDB/LocalStorage for seamless offline tracking,
            guaranteeing you can revise without an active internet connection.
          </p>
        </section>

        {/* Section 6: User Rights & Data Deletion */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            6. Your Rights & Data Deletion
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            You maintain full ownership of your study records. You can update profile details, wipe your local study
            cache, or delete your entire account and study logs directly from the Profile Settings tab.
          </p>
        </section>

        {/* Section 7: Company & Contact */}
        <section
          style={{
            backgroundColor: '#303134',
            border: '1px solid #3C4043',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
            Managed by Gothwad Tech
          </div>
          <p style={{ fontSize: '12.5px', color: '#9AA0A6', margin: 0, maxWidth: '340px' }}>
            Have questions regarding your data privacy? Reach out to Gothwad Tech directly.
          </p>
          <a
            href="https://gothwadtech.com"
            target="_blank"
            rel="noopener noreferrer"
            id="privacy-gothwadtech-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              backgroundColor: '#0494F4',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(4, 148, 244, 0.35)',
              marginTop: '4px',
            }}
          >
            <span>Visit Gothwadtech.com</span>
            <ExternalLink size={15} />
          </a>
        </section>
      </main>
    </div>
  );
};
