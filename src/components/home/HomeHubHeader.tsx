import React from 'react';
import { ActivityIcon } from '../icons/SvgIcons';

interface HomeHubHeaderProps {
  activeTab: 'overview' | 'weekly' | 'heatmap';
  onTabChange: (tab: 'overview' | 'weekly' | 'heatmap') => void;
}

export const HomeHubHeader: React.FC<HomeHubHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0,
          }}
        >
          <ActivityIcon size={16} />
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Daily Overview & Routine
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
            Consistency, streak shields & habit tracker
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--surface-variant)',
          padding: '2px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border)',
          gap: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => onTabChange('overview')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeTab === 'overview' ? 'var(--surface)' : 'transparent',
            color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'overview' ? 'var(--shadow-xs)' : 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onTabChange('weekly')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeTab === 'weekly' ? 'var(--surface)' : 'transparent',
            color: activeTab === 'weekly' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'weekly' ? 'var(--shadow-xs)' : 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          Weekly
        </button>
        <button
          type="button"
          onClick={() => onTabChange('heatmap')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeTab === 'heatmap' ? 'var(--surface)' : 'transparent',
            color: activeTab === 'heatmap' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'heatmap' ? 'var(--shadow-xs)' : 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          Heatmap
        </button>
      </div>
    </div>
  );
};
