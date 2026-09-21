import React from 'react';
import { ArrowLeft, ExternalLink, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <div
      className="app-container"
      id="terms-of-service-page"
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
        id="terms-page-header"
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
          id="terms-back-btn"
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
          Terms of Service
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
              backgroundColor: 'rgba(4, 148, 244, 0.16)',
              color: '#0494F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
              Prepmate Terms of Service
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

        {/* Section 1: Agreement to Terms */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            1. Agreement to Terms
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            By accessing or using <strong style={{ color: '#0494F4' }}>Prepmate</strong> (the &quot;Application&quot;),
            developed and managed by <strong style={{ color: '#FFFFFF' }}>Gothwad Tech</strong>, you acknowledge that you
            have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms,
            please do not use the Application.
          </p>
        </section>

        {/* Section 2: Purpose & Target Audience */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            2. Purpose & Academic Scope
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            Prepmate is a dedicated daily goal, study habit, and syllabus tracking companion engineered specifically for
            NEET UG aspirants across India. The application aids self-study consistency through personal goal milestones,
            syllabus coverage checklists, study timers, and peer study partner accountability.
          </p>
        </section>

        {/* Section 3: User Accounts & Security */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            3. User Accounts & Responsibilities
          </h2>
          <ul style={{ fontSize: '13px', color: '#BDC1C6', margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>You agree to provide accurate information when registering your email, username, and target NEET year.</li>
            <li>You are responsible for maintaining the confidentiality of your credentials and all activities under your account.</li>
            <li>Usernames must remain respectful. Offensive, impersonating, or abusive handles will be suspended.</li>
          </ul>
        </section>

        {/* Section 4: Partner Accountability Guidelines */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            4. Partner Accountability & Conduct
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            The study buddy features allow mutual goal viewing, peer challenges, and motivational leaderboard scores. Users
            must maintain a healthy, collaborative atmosphere. Harassment, spam partner requests, or malicious activities
            are strictly prohibited.
          </p>
        </section>

        {/* Section 5: Disclaimer regarding NTA / NEET */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            5. Independent Entity Disclaimer
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            Prepmate and Gothwad Tech are private, independent educational technology developers. Prepmate is{' '}
            <strong style={{ color: '#FFFFFF' }}>not affiliated with, endorsed by, or authorized by</strong> the National
            Testing Agency (NTA), the National Medical Commission (NMC), or any government examination authority. All NEET
            syllabus references are for academic planning and tracking purposes only.
          </p>
        </section>

        {/* Section 6: Intellectual Property */}
        <section
          style={{
            backgroundColor: '#2A2B2E',
            border: '1px solid #3C4043',
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            6. Intellectual Property
          </h2>
          <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
            All logos, visual UI layouts, algorithms, audio cues, and source code of Prepmate are the intellectual
            property of Gothwad Tech. Unauthorized reverse engineering, scraping, or distribution is prohibited.
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
            For queries, feedback, or legal notices, contact our team or visit our official portal.
          </p>
          <a
            href="https://gothwadtech.com"
            target="_blank"
            rel="noopener noreferrer"
            id="terms-gothwadtech-link"
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
            <span>Visit www.gothwadtech.com</span>
            <ExternalLink size={15} />
          </a>
        </section>
      </main>
    </div>
  );
};
