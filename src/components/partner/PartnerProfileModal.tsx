import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  FlameIcon,
  ClockIcon,
  CheckIcon,
  TargetIcon,
  SparklesIcon,
  SendIcon,
  UserXIcon,
} from '../icons/SvgIcons';
import { PartnerProfile, ActivePartnership } from '../../types';
import { useData } from '../../context/DataContext';

interface PartnerProfileModalProps {
  partner: PartnerProfile;
  partnership: ActivePartnership | null;
  onClose: () => void;
  onEndPartnership: () => void;
}

const QUICK_CHEERS = [
  'Padhai shuru karo bhai! ⏰',
  'Keep grinding! 🔥',
  '100 MCQs done today! 🎯',
  'Bio NCERT revision done? 📖',
  'Proud of your consistency! 🏆',
];

export const PartnerProfileModal: React.FC<PartnerProfileModalProps> = ({
  partner,
  partnership,
  onClose,
  onEndPartnership,
}) => {
  const { sendPartnerCheer } = useData();
  const [customCheer, setCustomCheer] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  const cheers = partnership?.cheers || [];

  const handleSendCheer = async (msg: string) => {
    if (!msg.trim()) return;
    setIsSending(true);
    try {
      await sendPartnerCheer(msg.trim());
      setCustomCheer('');
    } finally {
      setIsSending(false);
    }
  };

  const subjectBreakdown = partner.subjectBreakdown || {
    physicsHours: Number((partner.todayStudyHours * 0.4).toFixed(1)),
    chemistryHours: Number((partner.todayStudyHours * 0.3).toFixed(1)),
    biologyHours: Number((partner.todayStudyHours * 0.3).toFixed(1)),
  };

  const totalSubjectHours = Math.max(
    0.1,
    subjectBreakdown.physicsHours + subjectBreakdown.chemistryHours + subjectBreakdown.biologyHours
  );

  return (
    <div
      id="partner-profile-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0',
      }}
      onClick={onClose}
    >
      <div
        id="partner-profile-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '20px 16px 28px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.25)',
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: 'var(--border)',
            borderRadius: 'var(--radius-pill)',
            margin: '0 auto -4px auto',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: partner.avatarBg || '#0F9D58',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '18px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                position: 'relative',
              }}
            >
              {partner.name.slice(0, 2).toUpperCase()}
              {partner.isStudyingNow && (
                <span
                  title="Studying Now"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '14px',
                    height: '14px',
                    backgroundColor: 'var(--success)',
                    border: '2px solid var(--surface)',
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {partner.name}
                </h3>
                <Badge variant={partner.isStudyingNow ? 'success' : 'neutral'}>
                  {partner.isStudyingNow ? 'Studying Now 🟢' : (partner.lastActive || 'Active today')}
                </Badge>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, margin: '2px 0 0 0' }}>
                @{partner.username} • NEET {partner.targetYear || '2026'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Bio & Target Box */}
        <div
          style={{
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {partner.bio && (
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
              "{partner.bio}"
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <TargetIcon size={15} color="var(--primary)" />
              <span>Target Score:</span>
              <strong style={{ color: 'var(--primary)' }}>{partner.targetScore}+ / 720</strong>
            </div>

            {partner.currentSubject && (
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Subject: <strong>{partner.currentSubject}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 8px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: 'var(--primary)' }}>
              <ClockIcon size={16} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
              {partner.todayStudyHours}h
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Today's Study</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 8px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: 'var(--success)' }}>
              <CheckIcon size={16} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
              {partner.todayTasksCompleted}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Tasks Done</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 8px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: 'var(--flame)' }}>
              <FlameIcon size={16} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--flame)', display: 'block' }}>
              🔥 {partner.streakDays}d
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Day Streak</span>
          </div>
        </div>

        {/* Subject Breakdown Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Subject Distribution (Today)</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {partner.weeklyHours ? `${partner.weeklyHours}h this week` : 'Consistent'}
            </span>
          </div>

          {/* Progress Bar Stack */}
          <div
            style={{
              height: '10px',
              borderRadius: 'var(--radius-pill)',
              display: 'flex',
              overflow: 'hidden',
              backgroundColor: 'var(--surface-variant)',
            }}
          >
            <div
              style={{
                width: `${(subjectBreakdown.physicsHours / totalSubjectHours) * 100}%`,
                backgroundColor: '#0494F4',
              }}
              title={`Physics: ${subjectBreakdown.physicsHours}h`}
            />
            <div
              style={{
                width: `${(subjectBreakdown.chemistryHours / totalSubjectHours) * 100}%`,
                backgroundColor: '#E91E63',
              }}
              title={`Chemistry: ${subjectBreakdown.chemistryHours}h`}
            />
            <div
              style={{
                width: `${(subjectBreakdown.biologyHours / totalSubjectHours) * 100}%`,
                backgroundColor: '#0F9D58',
              }}
              title={`Biology: ${subjectBreakdown.biologyHours}h`}
            />
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0494F4' }} />
              Physics ({subjectBreakdown.physicsHours}h)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E91E63' }} />
              Chemistry ({subjectBreakdown.chemistryHours}h)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0F9D58' }} />
              Biology ({subjectBreakdown.biologyHours}h)
            </span>
          </div>
        </div>

        {/* Send Cheer / Motivation Nudge Section */}
        <div
          style={{
            backgroundColor: 'var(--surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SparklesIcon size={16} color="var(--warning)" />
            <span style={{ fontSize: '13px', fontWeight: 800 }}>Send Real-Time Nudge / Cheer</span>
          </div>

          {/* Quick Cheer Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {QUICK_CHEERS.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendCheer(chip)}
                disabled={isSending}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: isSending ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Write your custom cheer note..."
              value={customCheer}
              onChange={(e) => setCustomCheer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendCheer(customCheer);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSendCheer(customCheer)}
              disabled={!customCheer.trim() || isSending}
            >
              <SendIcon size={14} /> Send
            </Button>
          </div>
        </div>

        {/* Live Cheers Stream (if any) */}
        {cheers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Recent Motivational Cheers 💬
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
              {cheers.map((c) => (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '11px' }}>{c.senderName}</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-primary)' }}>{c.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Status Badge & End Partnership Option */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border)',
            paddingTop: '12px',
            marginTop: '4px',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            Real-time Sync Active
          </span>

          {!showConfirmEnd ? (
            <button
              type="button"
              onClick={() => setShowConfirmEnd(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <UserXIcon size={14} /> End Partnership
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button variant="outline" size="sm" onClick={() => setShowConfirmEnd(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={onEndPartnership}>
                Confirm Disconnect
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
