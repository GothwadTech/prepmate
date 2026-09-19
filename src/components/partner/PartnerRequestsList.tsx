import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  InboxIcon,
  SendIcon,
  CheckIcon,
  CloseIcon,
  TargetIcon,
  UserCheckIcon,
  FlameIcon,
} from '../icons/SvgIcons';
import { useData } from '../../context/DataContext';

interface PartnerRequestsListProps {
  onFindPartnerClick?: () => void;
}

export const PartnerRequestsList: React.FC<PartnerRequestsListProps> = ({ onFindPartnerClick }) => {
  const {
    receivedRequests,
    sentRequests,
    acceptPartnerRequest,
    rejectPartnerRequest,
    cancelPartnerRequest,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'received' | 'sent'>('received');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await acceptPartnerRequest(requestId);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await rejectPartnerRequest(requestId);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await cancelPartnerRequest(requestId);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card
      id="partner-requests-container"
      title="Partner Requests"
      subtitle="Manage incoming invitations & outgoing requests"
    >
      {/* Sub Tab Switcher */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--surface-variant)',
          borderRadius: 'var(--radius-pill)',
          padding: '3px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          id="partner-subtab-received"
          onClick={() => setActiveSubTab('received')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'received' ? 'var(--surface)' : 'transparent',
            color: activeSubTab === 'received' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeSubTab === 'received' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)',
          }}
        >
          <InboxIcon size={14} />
          <span>Received</span>
          {receivedRequests.length > 0 && (
            <span
              style={{
                backgroundColor: 'var(--danger)',
                color: '#FFF',
                borderRadius: 'var(--radius-pill)',
                fontSize: '10px',
                fontWeight: 800,
                padding: '1px 6px',
                minWidth: '16px',
                textAlign: 'center',
              }}
            >
              {receivedRequests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          id="partner-subtab-sent"
          onClick={() => setActiveSubTab('sent')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'sent' ? 'var(--surface)' : 'transparent',
            color: activeSubTab === 'sent' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeSubTab === 'sent' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)',
          }}
        >
          <SendIcon size={14} />
          <span>Sent</span>
          {sentRequests.length > 0 && (
            <span
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
              }}
            >
              {sentRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* RECEIVED REQUESTS CONTENT */}
      {activeSubTab === 'received' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          {receivedRequests.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '28px 16px',
                backgroundColor: 'var(--surface-variant)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                  color: 'var(--text-secondary)',
                }}
              >
                <InboxIcon size={22} />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0', fontSize: '14px' }}>
                Koi pending invitation nahi hai
              </p>
              <p style={{ fontSize: '12px', margin: '0 0 12px 0' }}>
                Apne study buddy ka username search karke use request bhejo!
              </p>
              {onFindPartnerClick && (
                <Button variant="outline" size="sm" onClick={onFindPartnerClick}>
                  Find Partner Search 🔍
                </Button>
              )}
            </div>
          ) : (
            receivedRequests.map((req) => {
              const isProcessing = processingId === req.id;
              const initials = req.senderName
                ? req.senderName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : req.senderUsername.slice(0, 2).toUpperCase();

              return (
                <div
                  key={req.id}
                  id={`received-request-card-${req.id}`}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(4,148,244,0.08)',
                  }}
                >
                  {/* Top: Avatar, Name, Time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: req.senderAvatarBg || 'var(--primary)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '14px',
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>

                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                          {req.senderName || `@${req.senderUsername}`}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                          @{req.senderUsername}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {formatTimeAgo(req.createdAt)}
                      </span>
                      {req.senderScore && (
                        <div style={{ marginTop: '2px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: 'var(--primary)',
                              backgroundColor: 'var(--primary-container)',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            🎯 {req.senderScore}+
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motivational Cheer Note from Sender */}
                  {req.message && (
                    <div
                      style={{
                        backgroundColor: 'var(--surface-variant)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                        borderLeft: '3px solid var(--primary)',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>
                        Message:
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '2px 0 0 0', fontStyle: 'italic' }}>
                        "{req.message}"
                      </p>
                    </div>
                  )}

                  {/* Accept & Reject Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<CloseIcon size={14} />}
                      onClick={() => handleReject(req.id)}
                      disabled={isProcessing}
                      id={`reject-partner-request-btn-${req.id}`}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckIcon size={15} />}
                      onClick={() => handleAccept(req.id)}
                      disabled={isProcessing}
                      id={`accept-partner-request-btn-${req.id}`}
                    >
                      {isProcessing ? 'Accepting...' : 'Accept Partner 🤝'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SENT REQUESTS CONTENT */}
      {activeSubTab === 'sent' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          {sentRequests.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '28px 16px',
                backgroundColor: 'var(--surface-variant)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                  color: 'var(--text-secondary)',
                }}
              >
                <SendIcon size={20} />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0', fontSize: '14px' }}>
                Koi outgoing request nahi bheji
              </p>
              <p style={{ fontSize: '12px', margin: '0 0 12px 0' }}>
                Kisi bhi aspirant ko search karke partner request send kar sakte ho!
              </p>
              {onFindPartnerClick && (
                <Button variant="outline" size="sm" onClick={onFindPartnerClick}>
                  Search Aspirants 🔍
                </Button>
              )}
            </div>
          ) : (
            sentRequests.map((req) => {
              const isProcessing = processingId === req.id;
              return (
                <div
                  key={req.id}
                  id={`sent-request-card-${req.id}`}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Sent to:
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '1px 0 0 0', color: 'var(--text-primary)' }}>
                        {req.receiverName || `@${req.receiverUsername}`}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                        @{req.receiverUsername}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'var(--warning-container)',
                          color: 'var(--warning)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontWeight: 700,
                        }}
                      >
                        ⏳ Awaiting Response
                      </span>
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {formatTimeAgo(req.createdAt)}
                      </span>
                    </div>
                  </div>

                  {req.message && (
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        backgroundColor: 'var(--surface-variant)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontStyle: 'italic',
                      }}
                    >
                      "{req.message}"
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(req.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Cancelling...' : 'Cancel Request'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
};
