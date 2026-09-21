import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AwardIcon, LogoutIcon } from '../icons/SvgIcons';

interface ProfileAccountActionsProps {
  showLogoutConfirm: boolean;
  setShowLogoutConfirm: (val: boolean) => void;
  onLogout: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const ProfileAccountActions: React.FC<ProfileAccountActionsProps> = ({
  showLogoutConfirm,
  setShowLogoutConfirm,
  onLogout,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <>
      {/* Account Actions: Logout */}
      <Card id="account-actions-card" title="Account Actions">
        {showLogoutConfirm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Kya aap sure hain ki aap log out karna chahte hain?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onLogout}
                id="confirm-logout-btn"
                style={{ flex: 1, background: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                Log Out
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="md"
            isFullWidth
            leftIcon={<LogoutIcon size={18} color="var(--danger)" />}
            onClick={() => setShowLogoutConfirm(true)}
            id="account-logout-btn"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            Log Out from Prepmate
          </Button>
        )}
      </Card>

      {/* App & Company Credit with www.gothwadtech.com */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
        id="company-credit-footer"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AwardIcon size={16} color="var(--primary)" />
          <strong style={{ color: 'var(--text-primary)' }}>Prepmate</strong>
        </div>
        <p>
          Built with ❤️ by{' '}
          <a
            href="https://www.gothwadtech.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
          >
            Gothwad Tech
          </a>{' '}
          for NEET Aspirants
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          {onOpenTerms && (
            <button
              type="button"
              onClick={onOpenTerms}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--text-secondary)',
                fontSize: '11px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Terms of Service
            </button>
          )}
          {onOpenTerms && onOpenPrivacy && <span>•</span>}
          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--text-secondary)',
                fontSize: '11px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Privacy Policy
            </button>
          )}
        </div>
      </div>
    </>
  );
};
