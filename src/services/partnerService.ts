/**
 * PrepMate - Partner & Request Service (Phase 9)
 * Handles username search, partner requests (send, accept, reject, cancel),
 * and partnership state with Firebase Firestore and local-first fallback caching.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  PartnerRequest,
  PartnerProfile,
  PartnerUserSearchResult,
  ActivePartnership,
  UserProfile,
  PartnerRelationStatus,
  PartnerCheer,
} from '../types';

const STORAGE_PARTNER_REQUESTS_KEY = 'prepmate_partner_requests_cache';
const STORAGE_PARTNERSHIP_KEY = 'prepmate_active_partnership_cache';

// Seed aspirants for search discovery and demo
export const SEED_NEET_ASPIRANTS: PartnerProfile[] = [
  {
    id: 'demo-p-101',
    name: 'Aman Sharma',
    username: 'amansharma_aiims',
    targetYear: '2026',
    targetScore: 690,
    todayStudyHours: 5.5,
    todayTasksCompleted: 4,
    streakDays: 6,
    avatarBg: '#0F9D58',
    bio: 'AIIMS New Delhi Dream | Daily 6+ hrs physics & bio practice',
    isStudyingNow: true,
    currentSubject: 'Physics',
    lastActive: 'Studying Now 🟢',
    weeklyHours: 36.5,
    subjectBreakdown: {
      physicsHours: 15.0,
      chemistryHours: 9.5,
      biologyHours: 12.0,
    },
  },
  {
    id: 'demo-p-102',
    name: 'Priya Verma',
    username: 'priya_neet26',
    targetYear: '2026',
    targetScore: 675,
    todayStudyHours: 4.8,
    todayTasksCompleted: 3,
    streakDays: 9,
    avatarBg: '#9C27B0',
    bio: 'Biology NCERT 360/360 Target | Revision enthusiast',
    isStudyingNow: false,
    currentSubject: 'Biology',
    lastActive: 'Active 25m ago',
    weeklyHours: 32.0,
    subjectBreakdown: {
      physicsHours: 8.0,
      chemistryHours: 10.0,
      biologyHours: 14.0,
    },
  },
  {
    id: 'demo-p-103',
    name: 'Rohit Kumar',
    username: 'rohit_physics',
    targetYear: '2026',
    targetScore: 660,
    todayStudyHours: 3.5,
    todayTasksCompleted: 2,
    streakDays: 4,
    avatarBg: '#0494F4',
    bio: 'Mastering mechanics & current electricity numericals',
    isStudyingNow: true,
    currentSubject: 'Physics',
    lastActive: 'Studying Now 🟢',
    weeklyHours: 24.5,
    subjectBreakdown: {
      physicsHours: 14.5,
      chemistryHours: 5.0,
      biologyHours: 5.0,
    },
  },
  {
    id: 'demo-p-104',
    name: 'Ananya Deshmukh',
    username: 'ananya_chem',
    targetYear: '2026',
    targetScore: 685,
    todayStudyHours: 6.0,
    todayTasksCompleted: 5,
    streakDays: 14,
    avatarBg: '#E91E63',
    bio: 'Organic chemistry reaction mechanisms & mock tests',
    isStudyingNow: false,
    currentSubject: 'Chemistry',
    lastActive: 'Active 1h ago',
    weeklyHours: 41.0,
    subjectBreakdown: {
      physicsHours: 10.0,
      chemistryHours: 18.0,
      biologyHours: 13.0,
    },
  },
  {
    id: 'demo-p-105',
    name: 'Arjun Patel',
    username: 'arjun_medic',
    targetYear: '2025',
    targetScore: 700,
    todayStudyHours: 7.2,
    todayTasksCompleted: 6,
    streakDays: 21,
    avatarBg: '#FF5722',
    bio: 'Dropper aiming top 500 AIR in NEET | Hard grind',
    isStudyingNow: true,
    currentSubject: 'Revision',
    lastActive: 'Studying Now 🟢',
    weeklyHours: 48.0,
    subjectBreakdown: {
      physicsHours: 16.0,
      chemistryHours: 15.0,
      biologyHours: 17.0,
    },
  },
  {
    id: 'demo-p-106',
    name: 'Dr. Sneha Kulkarni',
    username: 'dr_sneha26',
    targetYear: '2026',
    targetScore: 670,
    todayStudyHours: 4.2,
    todayTasksCompleted: 3,
    streakDays: 8,
    avatarBg: '#009688',
    bio: 'Future Doctor | Consistency beats intensity everyday',
    isStudyingNow: false,
    currentSubject: 'Biology',
    lastActive: 'Active 3h ago',
    weeklyHours: 29.5,
    subjectBreakdown: {
      physicsHours: 7.5,
      chemistryHours: 8.0,
      biologyHours: 14.0,
    },
  },
];

export const partnerService = {
  /**
   * Load all cached requests from localStorage
   */
  getLocalRequests(): PartnerRequest[] {
    try {
      const raw = localStorage.getItem(STORAGE_PARTNER_REQUESTS_KEY);
      if (!raw) {
        // Initialize with default pending request from Aman Sharma
        const defaultRequests: PartnerRequest[] = [
          {
            id: 'req-aman-101',
            senderId: 'demo-p-101',
            senderName: 'Aman Sharma',
            senderUsername: 'amansharma_aiims',
            senderScore: 690,
            senderTargetYear: '2026',
            senderAvatarBg: '#0F9D58',
            receiverId: 'current-user',
            receiverUsername: 'you',
            status: 'pending',
            message: 'Bhai sath me daily Physics numericals aur Bio revision karenge! Target 680+ 💪',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
        ];
        localStorage.setItem(STORAGE_PARTNER_REQUESTS_KEY, JSON.stringify(defaultRequests));
        return defaultRequests;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  /**
   * Save requests to localStorage
   */
  saveLocalRequests(requests: PartnerRequest[]): void {
    try {
      localStorage.setItem(STORAGE_PARTNER_REQUESTS_KEY, JSON.stringify(requests));
    } catch (e) {
      console.warn('Failed to save partner requests to local cache:', e);
    }
  },

  /**
   * Get active partnership from localStorage
   */
  getLocalPartnership(): ActivePartnership | null {
    try {
      const raw = localStorage.getItem(STORAGE_PARTNERSHIP_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save active partnership to localStorage
   */
  saveLocalPartnership(partnership: ActivePartnership | null): void {
    try {
      if (partnership) {
        localStorage.setItem(STORAGE_PARTNERSHIP_KEY, JSON.stringify(partnership));
      } else {
        localStorage.removeItem(STORAGE_PARTNERSHIP_KEY);
      }
    } catch (e) {
      console.warn('Failed to save active partnership to local cache:', e);
    }
  },

  /**
   * Fetch partner requests for current user (both received and sent)
   */
  async fetchRequests(currentUserId: string, currentUsername: string): Promise<{
    received: PartnerRequest[];
    sent: PartnerRequest[];
  }> {
    let allRequests: PartnerRequest[] = [];

    if (isFirebaseConfigured && db) {
      try {
        const receivedQuery = query(
          collection(db, 'partner_requests'),
          where('receiverId', '==', currentUserId)
        );
        const sentQuery = query(
          collection(db, 'partner_requests'),
          where('senderId', '==', currentUserId)
        );

        const [receivedSnap, sentSnap] = await Promise.all([
          getDocs(receivedQuery),
          getDocs(sentQuery),
        ]);

        const firestoreList: PartnerRequest[] = [];
        receivedSnap.forEach((d) => firestoreList.push({ id: d.id, ...(d.data() as Omit<PartnerRequest, 'id'>) }));
        sentSnap.forEach((d) => firestoreList.push({ id: d.id, ...(d.data() as Omit<PartnerRequest, 'id'>) }));

        if (firestoreList.length > 0) {
          allRequests = firestoreList;
          this.saveLocalRequests(allRequests);
        } else {
          allRequests = this.getLocalRequests();
        }
      } catch (err) {
        console.warn('Error fetching partner requests from Firestore, using local cache:', err);
        allRequests = this.getLocalRequests();
      }
    } else {
      allRequests = this.getLocalRequests();
    }

    const received = allRequests.filter(
      (r) =>
        (r.receiverId === currentUserId ||
          r.receiverUsername.toLowerCase() === currentUsername.toLowerCase() ||
          r.receiverId === 'current-user') &&
        r.status === 'pending'
    );

    const sent = allRequests.filter(
      (r) =>
        (r.senderId === currentUserId || r.senderId === 'current-user') &&
        r.status === 'pending'
    );

    return { received, sent };
  },

  /**
   * Search for users by username or name
   */
  async searchUsers(
    searchQueryText: string,
    currentUser: UserProfile,
    activePartnership: ActivePartnership | null,
    currentRequests: PartnerRequest[]
  ): Promise<PartnerUserSearchResult[]> {
    const q = searchQueryText.trim().toLowerCase().replace(/^@/, '');
    if (!q) return [];

    const resultsMap = new Map<string, PartnerUserSearchResult>();

    // 1. If Firebase is configured, search Firestore 'users' collection
    if (isFirebaseConfigured && db) {
      try {
        const usersRef = collection(db, 'users');
        const qSnap = await getDocs(query(usersRef, limit(30)));
        qSnap.forEach((docSnap) => {
          const u = docSnap.data() as UserProfile;
          if (
            u.username.toLowerCase().includes(q) ||
            u.displayName.toLowerCase().includes(q)
          ) {
            resultsMap.set(u.username.toLowerCase(), {
              uid: u.uid,
              displayName: u.displayName,
              username: u.username,
              targetYear: u.targetYear || '2026',
              targetScore: u.targetScore || 680,
              bio: u.bio,
              relationStatus: 'none',
            });
          }
        });
      } catch (err) {
        console.warn('Firestore search query fallback:', err);
      }
    }

    // 2. Also match from Seed Aspirants pool for instant discoverability
    SEED_NEET_ASPIRANTS.forEach((aspirant) => {
      if (
        aspirant.username.toLowerCase().includes(q) ||
        aspirant.name.toLowerCase().includes(q)
      ) {
        if (!resultsMap.has(aspirant.username.toLowerCase())) {
          resultsMap.set(aspirant.username.toLowerCase(), {
            uid: aspirant.id,
            displayName: aspirant.name,
            username: aspirant.username,
            targetYear: aspirant.targetYear,
            targetScore: aspirant.targetScore,
            avatarBg: aspirant.avatarBg,
            bio: aspirant.bio,
            relationStatus: 'none',
          });
        }
      }
    });

    // 3. Decorate each result with relationship status
    const finalResults: PartnerUserSearchResult[] = [];
    const myUid = currentUser.uid;
    const myUsername = currentUser.username.toLowerCase();

    resultsMap.forEach((candidate) => {
      let relation: PartnerRelationStatus = 'none';
      let pendingRequestId: string | undefined;

      // Check if self
      if (
        candidate.uid === myUid ||
        candidate.username.toLowerCase() === myUsername
      ) {
        relation = 'self';
      }
      // Check if already active partner
      else if (
        activePartnership &&
        activePartnership.status === 'active' &&
        (activePartnership.partner.username.toLowerCase() === candidate.username.toLowerCase() ||
          activePartnership.user2Id === candidate.uid ||
          activePartnership.user1Id === candidate.uid)
      ) {
        relation = 'partner';
      } else {
        // Check pending requests
        const sentPending = currentRequests.find(
          (r) =>
            r.status === 'pending' &&
            r.receiverUsername.toLowerCase() === candidate.username.toLowerCase()
        );
        if (sentPending) {
          relation = 'request_sent';
          pendingRequestId = sentPending.id;
        } else {
          const receivedPending = currentRequests.find(
            (r) =>
              r.status === 'pending' &&
              r.senderUsername.toLowerCase() === candidate.username.toLowerCase()
          );
          if (receivedPending) {
            relation = 'request_received';
            pendingRequestId = receivedPending.id;
          }
        }
      }

      finalResults.push({
        ...candidate,
        relationStatus: relation,
        pendingRequestId,
      });
    });

    return finalResults;
  },

  /**
   * Send a partner request to an aspirant
   */
  async sendRequest(
    sender: UserProfile,
    targetUser: { uid?: string; username: string; displayName?: string; targetScore?: number; targetYear?: string; avatarBg?: string },
    cheerMessage?: string
  ): Promise<PartnerRequest> {
    const cleanUsername = targetUser.username.trim().replace(/^@/, '').toLowerCase();
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const newRequest: PartnerRequest = {
      id: requestId,
      senderId: sender.uid,
      senderName: sender.displayName,
      senderUsername: sender.username,
      senderScore: sender.targetScore,
      senderTargetYear: sender.targetYear,
      senderAvatarBg: '#0494F4',
      receiverId: targetUser.uid || `user-${cleanUsername}`,
      receiverUsername: cleanUsername,
      receiverName: targetUser.displayName || cleanUsername,
      status: 'pending',
      message: cheerMessage?.trim() || 'Let’s crack NEET 2026 together! Daily revision & streak maintain karenge 💪',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        const reqRef = doc(db, 'partner_requests', requestId);
        await setDoc(reqRef, newRequest);
      } catch (err) {
        console.warn('Could not save partner request to Firestore, saved locally:', err);
      }
    }

    // Save to local cache
    const current = this.getLocalRequests();
    // Remove any previous cancelled or rejected requests for this user
    const filtered = current.filter(
      (r) => !(r.receiverUsername.toLowerCase() === cleanUsername && r.status !== 'accepted')
    );
    const updated = [newRequest, ...filtered];
    this.saveLocalRequests(updated);

    return newRequest;
  },

  /**
   * Accept a received partner request -> establishes active partnership
   */
  async acceptRequest(
    requestId: string,
    currentUser: UserProfile
  ): Promise<ActivePartnership> {
    const currentRequests = this.getLocalRequests();
    const req = currentRequests.find((r) => r.id === requestId);

    if (!req) {
      throw new Error('Request not found or expired.');
    }

    // Update status in Firestore
    if (isFirebaseConfigured && db) {
      try {
        const reqRef = doc(db, 'partner_requests', requestId);
        await updateDoc(reqRef, {
          status: 'accepted',
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Failed to update request in Firestore:', e);
      }
    }

    // Update local requests
    const updatedRequests = currentRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'accepted' as const, updatedAt: new Date().toISOString() } : r
    );
    this.saveLocalRequests(updatedRequests);

    // Look up sender details in seed pool or construct PartnerProfile
    const seed = SEED_NEET_ASPIRANTS.find(
      (s) => s.username.toLowerCase() === req.senderUsername.toLowerCase()
    );

    const partnerProfile: PartnerProfile = {
      id: req.senderId,
      name: req.senderName,
      username: req.senderUsername,
      targetYear: req.senderTargetYear || '2026',
      targetScore: req.senderScore || 680,
      todayStudyHours: seed?.todayStudyHours ?? 5.0,
      todayTasksCompleted: seed?.todayTasksCompleted ?? 4,
      streakDays: seed?.streakDays ?? 7,
      avatarBg: req.senderAvatarBg || seed?.avatarBg || '#0F9D58',
      bio: seed?.bio || 'AIIMS New Delhi Dream | Consistent daily practice',
      isStudyingNow: seed?.isStudyingNow ?? true,
      currentSubject: seed?.currentSubject ?? 'Physics',
      lastActive: seed?.lastActive ?? 'Studying Now 🟢',
      weeklyHours: seed?.weeklyHours ?? 36.5,
      subjectBreakdown: seed?.subjectBreakdown ?? {
        physicsHours: 15.0,
        chemistryHours: 9.5,
        biologyHours: 12.0,
      },
    };

    const partnership: ActivePartnership = {
      id: `partner-${Date.now()}`,
      user1Id: currentUser.uid,
      user2Id: req.senderId,
      partner: partnerProfile,
      connectedAt: new Date().toISOString(),
      status: 'active',
      lastSyncedAt: new Date().toISOString(),
      cheers: [
        {
          id: `cheer-welcome-${Date.now()}`,
          senderId: req.senderId,
          senderName: req.senderName,
          message: req.message || 'Bhai sath me daily Physics numericals aur Bio revision karenge! Target 680+ 💪',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Save partnership in Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        const pRef = doc(db, 'partnerships', partnership.id);
        await setDoc(pRef, partnership);
      } catch (e) {
        console.warn('Failed to save partnership in Firestore:', e);
      }
    }

    this.saveLocalPartnership(partnership);
    return partnership;
  },

  /**
   * Subscribe to real-time partnership updates (Firestore onSnapshot + pulse fallback)
   */
  subscribeToPartnership(
    partnershipId: string,
    onUpdate: (partnership: ActivePartnership | null) => void
  ): () => void {
    let unsubscribeFirestore: Unsubscribe | null = null;

    if (isFirebaseConfigured && db) {
      try {
        const pRef = doc(db, 'partnerships', partnershipId);
        unsubscribeFirestore = onSnapshot(
          pRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as ActivePartnership;
              if (data.status === 'active') {
                this.saveLocalPartnership(data);
                onUpdate(data);
              } else {
                this.saveLocalPartnership(null);
                onUpdate(null);
              }
            } else {
              onUpdate(null);
            }
          },
          (err) => {
            console.warn('Firestore onSnapshot error, using local state:', err);
          }
        );
      } catch (err) {
        console.warn('Error setting up onSnapshot:', err);
      }
    }

    // Also provide a realistic study simulation interval for demo/local testing
    const interval = setInterval(() => {
      const current = this.getLocalPartnership();
      if (current && current.status === 'active') {
        const updated: ActivePartnership = {
          ...current,
          lastSyncedAt: new Date().toISOString(),
          partner: {
            ...current.partner,
            lastActive: current.partner.isStudyingNow ? 'Studying Now 🟢' : 'Active 5m ago',
          },
        };
        this.saveLocalPartnership(updated);
        onUpdate(updated);
      }
    }, 45000);

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      clearInterval(interval);
    };
  },

  /**
   * Send a cheer/nudge to partner
   */
  async sendCheer(
    partnershipId: string,
    senderId: string,
    senderName: string,
    message: string
  ): Promise<PartnerCheer> {
    const newCheer: PartnerCheer = {
      id: `cheer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId,
      senderName,
      message,
      timestamp: new Date().toISOString(),
    };

    const current = this.getLocalPartnership();
    if (current && current.id === partnershipId) {
      const updatedCheers = [newCheer, ...(current.cheers || [])].slice(0, 15);
      const updatedPartnership: ActivePartnership = {
        ...current,
        cheers: updatedCheers,
        lastSyncedAt: new Date().toISOString(),
      };
      this.saveLocalPartnership(updatedPartnership);

      if (isFirebaseConfigured && db) {
        try {
          const pRef = doc(db, 'partnerships', partnershipId);
          await updateDoc(pRef, {
            cheers: updatedCheers,
            lastSyncedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Failed to sync cheer to Firestore:', e);
        }
      }
    }

    return newCheer;
  },

  /**
   * Broadcast current user's study progress to partnership document
   */
  async syncMyActivity(
    partnershipId: string,
    payload: {
      todayStudyHours: number;
      todayTasksCompleted: number;
      streakDays: number;
      isStudyingNow?: boolean;
      currentSubject?: string;
    }
  ): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const pRef = doc(db, 'partnerships', partnershipId);
        await updateDoc(pRef, {
          user1Stats: payload,
          lastSyncedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Could not sync user activity to partner document:', e);
      }
    }
  },

  /**
   * Reject a received partner request
   */
  async rejectRequest(requestId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const reqRef = doc(db, 'partner_requests', requestId);
        await updateDoc(reqRef, {
          status: 'rejected',
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Failed to reject in Firestore:', e);
      }
    }

    const current = this.getLocalRequests();
    const updated = current.map((r) =>
      r.id === requestId ? { ...r, status: 'rejected' as const, updatedAt: new Date().toISOString() } : r
    );
    this.saveLocalRequests(updated);
  },

  /**
   * Cancel an outgoing request sent by the user
   */
  async cancelRequest(requestId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const reqRef = doc(db, 'partner_requests', requestId);
        await deleteDoc(reqRef);
      } catch (e) {
        console.warn('Failed to delete request from Firestore:', e);
      }
    }

    const current = this.getLocalRequests();
    const updated = current.filter((r) => r.id !== requestId);
    this.saveLocalRequests(updated);
  },

  /**
   * End an active partnership
   */
  async endPartnership(partnershipId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const pRef = doc(db, 'partnerships', partnershipId);
        await updateDoc(pRef, { status: 'ended' });
      } catch (e) {
        console.warn('Failed to end partnership in Firestore:', e);
      }
    }

    this.saveLocalPartnership(null);
  },
};
