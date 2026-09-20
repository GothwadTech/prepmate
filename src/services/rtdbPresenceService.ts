/**
 * Prepmate - Firebase Realtime Database (RTDB) Presence & Live Duel Sync
 * 
 * Provides:
 * 1. Online/Offline status with onDisconnect() synchronization
 * 2. Live study timer broadcasting for partner duel
 * 3. Instant live cheers without polling
 */

import {
  ref,
  set,
  onValue,
  onDisconnect,
  serverTimestamp,
  push,
  Unsubscribe,
} from 'firebase/database';
import { rtdb } from '../firebase/config';

export interface UserPresence {
  state: 'online' | 'offline';
  isStudying: boolean;
  currentSubject?: string;
  currentChapter?: string;
  lastChanged: number | object;
}

export interface LiveCheerMessage {
  id?: string;
  fromUserId: string;
  fromName: string;
  type: 'fire' | 'clap' | 'target' | 'heart';
  message: string;
  timestamp: number | object;
}

/**
 * Connect user presence to RTDB with automatic disconnect handling
 */
export function setupUserPresence(
  userId: string,
  isStudying: boolean = false,
  currentSubject?: string,
  currentChapter?: string
): () => void {
  if (!rtdb || !userId) {
    return () => {};
  }

  const userStatusRef = ref(rtdb, `/status/${userId}`);
  const connectedRef = ref(rtdb, '.info/connected');

  const unsubscribe = onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }

    // When connection drops, automatically set status to offline
    const isOfflineForDatabase: UserPresence = {
      state: 'offline',
      isStudying: false,
      lastChanged: serverTimestamp(),
    };

    onDisconnect(userStatusRef)
      .set(isOfflineForDatabase)
      .then(() => {
        // Set user to online
        const isOnlineForDatabase: UserPresence = {
          state: 'online',
          isStudying,
          currentSubject: currentSubject || '',
          currentChapter: currentChapter || '',
          lastChanged: serverTimestamp(),
        };

        set(userStatusRef, isOnlineForDatabase);
      })
      .catch((err) => {
        console.warn('RTDB onDisconnect registration failed:', err);
      });
  });

  return () => {
    unsubscribe();
    if (rtdb) {
      set(userStatusRef, {
        state: 'offline',
        isStudying: false,
        lastChanged: serverTimestamp(),
      }).catch(() => {});
    }
  };
}

/**
 * Update active study status in Realtime Database
 */
export async function updateStudyPresence(
  userId: string,
  isStudying: boolean,
  currentSubject?: string,
  currentChapter?: string
): Promise<void> {
  if (!rtdb || !userId) return;

  const userStatusRef = ref(rtdb, `/status/${userId}`);
  try {
    await set(userStatusRef, {
      state: 'online',
      isStudying,
      currentSubject: currentSubject || '',
      currentChapter: currentChapter || '',
      lastChanged: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to update RTDB study presence:', err);
  }
}

/**
 * Listen to a partner's live presence & studying status
 */
export function listenToPartnerPresence(
  partnerId: string,
  onStatusChange: (status: UserPresence | null) => void
): () => void {
  if (!rtdb || !partnerId) {
    onStatusChange(null);
    return () => {};
  }

  const partnerStatusRef = ref(rtdb, `/status/${partnerId}`);
  const unsubscribe = onValue(
    partnerStatusRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onStatusChange(data as UserPresence);
      } else {
        onStatusChange(null);
      }
    },
    (error) => {
      console.warn('RTDB partner presence error:', error);
      onStatusChange(null);
    }
  );

  return () => {
    unsubscribe();
  };
}

/**
 * Send an instantaneous cheer via RTDB
 */
export async function sendInstantCheer(
  toUserId: string,
  cheer: Omit<LiveCheerMessage, 'timestamp'>
): Promise<void> {
  if (!rtdb || !toUserId) return;

  const cheersRef = ref(rtdb, `/cheers/${toUserId}`);
  const newCheerRef = push(cheersRef);
  await set(newCheerRef, {
    ...cheer,
    timestamp: serverTimestamp(),
  });
}

/**
 * Listen for incoming live cheers via RTDB
 */
export function listenForInstantCheers(
  userId: string,
  onCheer: (cheer: LiveCheerMessage) => void
): () => void {
  if (!rtdb || !userId) {
    return () => {};
  }

  const cheersRef = ref(rtdb, `/cheers/${userId}`);
  const unsubscribe = onValue(cheersRef, (snapshot) => {
    const val = snapshot.val();
    if (val) {
      const keys = Object.keys(val);
      const latestKey = keys[keys.length - 1];
      if (latestKey) {
        onCheer({
          id: latestKey,
          ...val[latestKey],
        });
      }
    }
  });

  return () => {
    unsubscribe();
  };
}
