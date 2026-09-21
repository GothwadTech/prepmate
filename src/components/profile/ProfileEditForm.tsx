import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ProfileEditFormProps {
  displayName: string;
  setDisplayName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  targetYear: string;
  setTargetYear: (val: string) => void;
  targetScore: string;
  setTargetScore: (val: string) => void;
  dreamCollege: string;
  setDreamCollege: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  saving: boolean;
  savedSuccess: boolean;
  onSave: (e: React.FormEvent) => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  displayName,
  setDisplayName,
  username,
  setUsername,
  targetYear,
  setTargetYear,
  targetScore,
  setTargetScore,
  dreamCollege,
  setDreamCollege,
  bio,
  setBio,
  saving,
  savedSuccess,
  onSave,
}) => {
  return (
    <Card id="edit-profile-card" title="Edit Aspirant Profile & Target">
      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Input
            label="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Aryan Sharma"
            id="profile-display-name-input"
          />
          <Input
            label="Username (@handle)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. aryan_neet"
            id="profile-username-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Input
            label="Target NEET Year"
            value={targetYear}
            onChange={(e) => setTargetYear(e.target.value)}
            placeholder="e.g. 2026"
            id="target-year-input"
          />
          <Input
            label="Target Score (Out of 720)"
            value={targetScore}
            onChange={(e) => setTargetScore(e.target.value)}
            placeholder="e.g. 685"
            type="number"
            id="target-score-input"
          />
        </div>

        <Input
          label="Dream Medical College"
          value={dreamCollege}
          onChange={(e) => setDreamCollege(e.target.value)}
          placeholder="e.g. AIIMS New Delhi, MAMC, VMMC, AFMC"
          id="dream-college-input"
        />

        <Input
          label="Aspirant Motto / Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="e.g. Doctor in the making 🩺✨"
          id="user-bio-input"
        />

        <Button type="submit" variant="primary" size="md" isFullWidth disabled={saving} id="save-profile-btn">
          {saving ? 'Saving Profile...' : 'Save Profile & Target Changes'}
        </Button>

        {savedSuccess && (
          <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center' }}>
            ✓ Aspirant Profile & Settings saved successfully!
          </span>
        )}
      </form>
    </Card>
  );
};
