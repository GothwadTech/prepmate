import React from 'react';

export const AppLoadingScreen: React.FC = () => {
  return (
    <div className="app-viewport" id="prepmate-viewport">
      <div
        className="app-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          minHeight: '100vh',
          background: 'var(--bg)',
        }}
      >
        <img
          src="/icon-192.png"
          alt="Prepmate Logo"
          style={{ width: '64px', height: '64px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.4px' }}>
            PrepMate
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Loading your study dashboard...
          </p>
        </div>
        <div
          style={{
            width: '120px',
            height: '3px',
            background: 'var(--surface-variant)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '60%',
              height: '100%',
              background: 'var(--primary)',
              borderRadius: '9999px',
              animation: 'pulse 1.2s infinite ease-in-out',
            }}
          />
        </div>
      </div>
    </div>
  );
};
