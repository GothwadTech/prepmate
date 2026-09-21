import React from 'react';
import { AppTab } from '../../types';
import {
  HomeIcon,
  TasksIcon,
  GoalsIcon,
  PartnersIcon,
  BookIcon,
} from '../icons/SvgIcons';
import { useData } from '../../context/DataContext';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

interface NavItemConfig {
  id: AppTab;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { pendingPartnerRequestsCount } = useData();

  const items: NavItemConfig[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (active) => <HomeIcon size={22} color={active ? 'var(--primary)' : 'currentColor'} />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: (active) => <TasksIcon size={22} color={active ? 'var(--primary)' : 'currentColor'} />,
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: (active) => <GoalsIcon size={22} color={active ? 'var(--primary)' : 'currentColor'} />,
    },
    {
      id: 'partners',
      label: 'Partners',
      icon: (active) => <PartnersIcon size={22} color={active ? 'var(--primary)' : 'currentColor'} />,
      badge: pendingPartnerRequestsCount,
    },
    {
      id: 'syllabus',
      label: 'Syllabus',
      icon: (active) => <BookIcon size={22} color={active ? 'var(--primary)' : 'currentColor'} />,
    },
  ];

  return (
    <nav
      className="bottom-nav"
      id="bottom-navigation-bar"
      role="navigation"
      aria-label="Main Navigation"
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-tab-${item.id}`}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
            aria-selected={isActive}
            role="tab"
          >
            <div className="nav-icon-wrap" style={{ position: 'relative' }}>
              {item.icon(isActive)}
              {Boolean(item.badge && item.badge > 0) && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '6px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(234, 67, 53, 0.4)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
