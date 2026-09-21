import { UserProfile } from '../types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username: string;
  targetYear: string;
  targetScore: number;
}

export const LOCAL_STORAGE_USER_KEY = 'prepmate_auth_user_active';

/**
 * Clean data so undefined properties are never passed to Firestore setDoc/updateDoc
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      clean[k] = v;
    }
  }
  return clean;
}
