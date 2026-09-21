import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile,
  PartnerRequest,
  PartnerUserSearchResult,
  ActivePartnership,
  PartnerProfile,
  UserStats,
} from '../types';
import { partnerService } from '../services/partnerService';

export function usePartnerIntegration(
  user: UserProfile | null,
  userId: string,
  stats: UserStats,
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void
) {
  const [receivedRequests, setReceivedRequests] = useState<PartnerRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PartnerRequest[]>([]);
  const [activePartnership, setActivePartnership] = useState<ActivePartnership | null>(() => {
    return partnerService.getLocalPartnership();
  });

  const activePartner = activePartnership?.partner || null;
  const pendingPartnerRequestsCount = receivedRequests.length;

  const currentUserProfile = useMemo<UserProfile>(() => {
    return (
      user || {
        uid: userId,
        email: '',
        displayName: 'You (Aspirant)',
        username: 'you',
        targetYear: stats.targetYear || '2026',
        targetScore: stats.targetScore || 685,
        createdAt: new Date().toISOString(),
      }
    );
  }, [user, userId, stats.targetYear, stats.targetScore]);

  const refreshPartnerData = useCallback(async () => {
    try {
      const p = partnerService.getLocalPartnership();
      setActivePartnership(p);
      const reqs = await partnerService.fetchRequests(userId, currentUserProfile.username);
      setReceivedRequests(reqs.received);
      setSentRequests(reqs.sent);
    } catch (e) {
      console.warn('Failed to load partner data:', e);
    }
  }, [userId, currentUserProfile.username]);

  useEffect(() => {
    refreshPartnerData();
  }, [refreshPartnerData]);

  // Real-time Firestore listener for active partnership
  useEffect(() => {
    if (!activePartnership?.id) return;

    const unsubscribe = partnerService.subscribeToPartnership(
      activePartnership.id,
      (updatedPartnership) => {
        if (updatedPartnership) {
          setActivePartnership(updatedPartnership);
        } else {
          setActivePartnership(null);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activePartnership?.id]);

  // Broadcast study stats to active partner
  useEffect(() => {
    if (!activePartnership?.id) return;
    const studyHrs = Number((stats.todayStudyMinutes / 60).toFixed(1));
    partnerService.syncMyActivity(activePartnership.id, {
      todayStudyHours: studyHrs,
      todayTasksCompleted: stats.tasksCompletedToday,
      streakDays: stats.streakDays,
      isStudyingNow: false,
    });
  }, [activePartnership?.id, stats.todayStudyMinutes, stats.tasksCompletedToday, stats.streakDays]);

  const searchPartners = useCallback(
    async (q: string): Promise<PartnerUserSearchResult[]> => {
      const allReqs = [...receivedRequests, ...sentRequests];
      return partnerService.searchUsers(q, currentUserProfile, activePartnership, allReqs);
    },
    [receivedRequests, sentRequests, currentUserProfile, activePartnership]
  );

  const sendPartnerRequest = useCallback(
    async (
      targetUser: { uid?: string; username: string; displayName?: string; targetScore?: number; targetYear?: string; avatarBg?: string },
      cheerMessage?: string
    ): Promise<void> => {
      try {
        const newReq = await partnerService.sendRequest(currentUserProfile, targetUser, cheerMessage);
        setSentRequests((prev) => [newReq, ...prev.filter((r) => r.receiverUsername !== newReq.receiverUsername)]);
        showToast(`Partner request sent to @${newReq.receiverUsername}! 🤝`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to send request.', 'error');
        throw err;
      }
    },
    [currentUserProfile, showToast]
  );

  const acceptPartnerRequest = useCallback(
    async (requestId: string): Promise<void> => {
      try {
        const newPartnership = await partnerService.acceptRequest(requestId, currentUserProfile);
        setActivePartnership(newPartnership);
        setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
        showToast(`🎉 Partnership confirmed with ${newPartnership.partner.name}! Ready to compete on VS Board.`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to accept request.', 'error');
        throw err;
      }
    },
    [currentUserProfile, showToast]
  );

  const rejectPartnerRequest = useCallback(
    async (requestId: string): Promise<void> => {
      try {
        await partnerService.rejectRequest(requestId);
        setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
        showToast('Request declined.', 'info');
      } catch (err: any) {
        showToast('Failed to decline request.', 'error');
      }
    },
    [showToast]
  );

  const cancelPartnerRequest = useCallback(
    async (requestId: string): Promise<void> => {
      try {
        await partnerService.cancelRequest(requestId);
        setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
        showToast('Partner request cancelled.', 'info');
      } catch (err: any) {
        showToast('Failed to cancel request.', 'error');
      }
    },
    [showToast]
  );

  const endCurrentPartnership = useCallback(async (): Promise<void> => {
    if (!activePartnership) return;
    try {
      await partnerService.endPartnership(activePartnership.id);
      setActivePartnership(null);
      showToast('Partnership ended.', 'info');
    } catch (err: any) {
      showToast('Failed to end partnership.', 'error');
    }
  }, [activePartnership, showToast]);

  const sendPartnerCheer = useCallback(
    async (message: string): Promise<void> => {
      if (!activePartnership) return;
      try {
        await partnerService.sendCheer(
          activePartnership.id,
          currentUserProfile.uid,
          currentUserProfile.displayName,
          message
        );
        showToast('Cheer nudge sent to partner! 🎉', 'success');
      } catch (err: any) {
        showToast('Failed to send cheer.', 'error');
      }
    },
    [activePartnership, currentUserProfile, showToast]
  );

  return {
    receivedRequests,
    sentRequests,
    pendingPartnerRequestsCount,
    activePartnership,
    activePartner,
    refreshPartnerData,
    searchPartners,
    sendPartnerRequest,
    acceptPartnerRequest,
    rejectPartnerRequest,
    cancelPartnerRequest,
    endCurrentPartnership,
    sendPartnerCheer,
  };
}
