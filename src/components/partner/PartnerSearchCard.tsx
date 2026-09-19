import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import {
  SearchIcon,
  UserPlusIcon,
  CheckIcon,
  CloseIcon,
  SparklesIcon,
  FlameIcon,
  TargetIcon,
  SendIcon,
} from '../icons/SvgIcons';
import { PartnerUserSearchResult } from '../../types';
import { useData } from '../../context/DataContext';

interface PartnerSearchCardProps {
  onGoToRequests?: () => void;
}

export const PartnerSearchCard: React.FC<PartnerSearchCardProps> = ({ onGoToRequests }) => {
  const { searchPartners, sendPartnerRequest, cancelPartnerRequest } = useData();
  const [queryText, setQueryText] = useState<string>('');
  const [results, setResults] = useState<PartnerUserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCheerTarget, setActiveCheerTarget] = useState<PartnerUserSearchResult | null>(null);
  const [customCheer, setCustomCheer] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Quick suggestion tags
  const suggestionFilters = ['NEET 2026', 'Target 680+', 'All Aspirants'];
  const [activeFilter, setActiveFilter] = useState<string>('All Aspirants');

  // Quick Cheer templates
  const cheerTemplates = [
    'Bhai sath me daily Physics numericals aur Bio revision karenge! Target 680+ 💪',
    'Let’s crack NEET together! Daily tasks compete karte hain 🔥',
    'Daily 100+ MCQs complete karenge aur streak preserve rakhenge 🎯',
  ];

  // Perform search (or load default suggestions if empty)
  const performSearch = async (searchTerm: string) => {
    setIsSearching(true);
    try {
      // If empty, search a broad query or seed set
      const term = searchTerm.trim() || 'a';
      const searchRes = await searchPartners(term);
      setResults(searchRes);
    } catch (err) {
      console.warn('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    performSearch(queryText);
  }, [queryText]);

  const handleOpenCheerModal = (user: PartnerUserSearchResult) => {
    setActiveCheerTarget(user);
    setCustomCheer(cheerTemplates[0]);
  };

  const handleSendRequest = async () => {
    if (!activeCheerTarget) return;
    setIsSending(true);
    try {
      await sendPartnerRequest(
        {
          uid: activeCheerTarget.uid,
          username: activeCheerTarget.username,
          displayName: activeCheerTarget.displayName,
          targetScore: activeCheerTarget.targetScore,
          targetYear: activeCheerTarget.targetYear,
          avatarBg: activeCheerTarget.avatarBg,
        },
        customCheer
      );
      // Refresh local results view
      setResults((prev) =>
        prev.map((item) =>
          item.username.toLowerCase() === activeCheerTarget.username.toLowerCase()
            ? { ...item, relationStatus: 'request_sent' }
            : item
        )
      );
      setActiveCheerTarget(null);
      setCustomCheer('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelRequest = async (user: PartnerUserSearchResult) => {
    if (!user.pendingRequestId) return;
    await cancelPartnerRequest(user.pendingRequestId);
    setResults((prev) =>
      prev.map((item) =>
        item.username.toLowerCase() === user.username.toLowerCase()
          ? { ...item, relationStatus: 'none', pendingRequestId: undefined }
          : item
      )
    );
  };

  // Filtered results based on chips
  const displayResults = results.filter((item) => {
    if (activeFilter === 'NEET 2026') return item.targetYear === '2026';
    if (activeFilter === 'Target 680+') return (item.targetScore || 0) >= 680;
    return true;
  });

  return (
    <Card
      id="partner-search-module"
      title="Find Study Partner"
      subtitle="Search by username (@username) or student name"
      action={
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <SparklesIcon size={16} color="var(--primary)" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>
            NEET Aspirants Pool
          </span>
        </div>
      }
    >
      {/* Search Input Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            id="partner-username-search-input"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search e.g. amansharma, priya, rohit..."
            style={{
              width: '100%',
              padding: '10px 36px 10px 38px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-variant)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
            }}
          />
          {queryText && (
            <button
              type="button"
              onClick={() => setQueryText('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              aria-label="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestion Filter Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', marginTop: '2px' }}>
        {suggestionFilters.map((filter) => {
          const isSelected = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '11px',
                fontWeight: 600,
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isSelected ? 'var(--primary-container)' : 'var(--surface)',
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Aspirants Result List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        {isSearching && (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Searching aspirants...
          </div>
        )}

        {!isSearching && displayResults.length === 0 && (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--surface-variant)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
            }}
          >
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Koi aspirant nahi mila
            </p>
            <p style={{ fontSize: '12px' }}>
              Dusra username try karein ya seedhe link share karke invite karein.
            </p>
          </div>
        )}

        {!isSearching &&
          displayResults.map((candidate) => {
            const initials = candidate.displayName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            const isSelf = candidate.relationStatus === 'self';
            const isPartner = candidate.relationStatus === 'partner';
            const isSent = candidate.relationStatus === 'request_sent';
            const isReceived = candidate.relationStatus === 'request_received';

            return (
              <div
                key={candidate.uid || candidate.username}
                id={`partner-candidate-${candidate.username}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: 'var(--surface)',
                  border: isPartner
                    ? '1.5px solid var(--success)'
                    : isSent
                    ? '1px solid var(--warning)'
                    : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  {/* Avatar & User Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: candidate.avatarBg || 'var(--primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '14px',
                        flexShrink: 0,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                          {candidate.displayName}
                        </h4>
                        {isPartner && <Badge variant="success">Partner</Badge>}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, margin: '1px 0 0 0' }}>
                        @{candidate.username}
                      </p>
                    </div>
                  </div>

                  {/* Target & Score Pill */}
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--surface-variant)',
                        color: 'var(--text-secondary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <TargetIcon size={12} color="var(--primary)" />
                      {candidate.targetScore}+ ({candidate.targetYear})
                    </span>
                  </div>
                </div>

                {/* Aspirant Bio/Goal */}
                {candidate.bio && (
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      backgroundColor: 'var(--surface-variant)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    "{candidate.bio}"
                  </p>
                )}

                {/* Actions Button Row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                  {isSelf ? (
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, padding: '6px 8px' }}>
                      (You)
                    </span>
                  ) : isPartner ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--success)',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckIcon size={15} /> Connected Study Partner
                      </span>
                    </div>
                  ) : isSent ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--warning)',
                          fontWeight: 600,
                          padding: '4px 8px',
                          backgroundColor: 'var(--warning-container)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        ⏳ Request Pending
                      </span>
                      {candidate.pendingRequestId && (
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(candidate)}
                          style={{
                            fontSize: '11px',
                            color: 'var(--danger)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ) : isReceived ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGoToRequests?.()}
                    >
                      Inbox me Request Aayi Hai 📥
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<UserPlusIcon size={14} />}
                      onClick={() => handleOpenCheerModal(candidate)}
                      id={`send-partner-btn-${candidate.username}`}
                    >
                      Partner Banao 🤝
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Inline Cheer Message Modal / Dialog */}
      {activeCheerTarget && (
        <div
          id="send-request-cheer-modal"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--surface)',
              width: '100%',
              maxWidth: '400px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: activeCheerTarget.avatarBg || 'var(--primary)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  {activeCheerTarget.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Send Partner Request
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                    to @{activeCheerTarget.username}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveCheerTarget(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '4px',
                }}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Motivational Cheer Message Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Motivation Note / Message (Optional):
              </label>
              <textarea
                rows={3}
                value={customCheer}
                onChange={(e) => setCustomCheer(e.target.value)}
                placeholder="Write a cheer message..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-variant)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Quick Templates */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Quick Cheer Suggestions:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                {cheerTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomCheer(template)}
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: customCheer === template ? 'var(--primary-container)' : 'var(--surface-variant)',
                      border: customCheer === template ? '1px solid var(--primary)' : '1px solid transparent',
                      color: customCheer === template ? 'var(--primary)' : 'var(--text-primary)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    "{template}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCheerTarget(null)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<SendIcon size={14} />}
                onClick={handleSendRequest}
                disabled={isSending}
                id="confirm-send-partner-request-btn"
              >
                {isSending ? 'Sending...' : 'Request Bhejo 🚀'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
