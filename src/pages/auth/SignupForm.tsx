import React from 'react';
import { Eye, EyeOff, Mail, Lock, User, Target, Calendar } from 'lucide-react';

interface SignupFormProps {
  name: string;
  setName: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  targetYear: string;
  setTargetYear: (v: string) => void;
  targetScore: string;
  setTargetScore: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  submitting: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  name,
  setName,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  targetYear,
  setTargetYear,
  targetScore,
  setTargetScore,
  showPassword,
  setShowPassword,
  submitting,
  error,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxSizing: 'border-box',
      }}
    >
      {/* Full Name */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={iconStyle}><User size={18} /></div>
        <input
          type="text"
          placeholder="Full Name (e.g., Aarav Sharma)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      {/* Username */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={iconStyle}><span style={{ fontSize: '15px', fontWeight: 800 }}>@</span></div>
        <input
          type="text"
          placeholder="Unique Username (e.g., aarav_neet)"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
          required
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={iconStyle}><Mail size={18} /></div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      {/* Password */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={iconStyle}><Lock size={18} /></div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Create Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ ...inputStyle, paddingRight: '46px' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Target Year and Score Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <div style={iconStyle}><Calendar size={18} /></div>
          <select
            value={targetYear}
            onChange={(e) => setTargetYear(e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          >
            <option value="2025">NEET 2025</option>
            <option value="2026">NEET 2026</option>
            <option value="2027">NEET 2027</option>
          </select>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={iconStyle}><Target size={18} /></div>
          <input
            type="number"
            min={400}
            max={720}
            placeholder="Target (720)"
            value={targetScore}
            onChange={(e) => setTargetScore(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(234, 67, 53, 0.12)',
            border: '1px solid rgba(234, 67, 53, 0.3)',
            color: 'var(--danger)',
            fontSize: '12.5px',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !name || !username || !email || password.length < 6}
        style={{
          width: '100%',
          padding: '14px 20px',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 800,
          borderRadius: '14px',
          border: 'none',
          cursor: submitting || !name || !username || !email || password.length < 6 ? 'not-allowed' : 'pointer',
          opacity: submitting || !name || !username || !email || password.length < 6 ? 0.55 : 1,
          boxShadow: '0 3px 12px rgba(4, 148, 244, 0.32)',
          marginTop: '6px',
          transition: 'all 0.2s ease',
        }}
      >
        {submitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-tertiary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px 13px 46px',
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  fontSize: '14px',
  color: 'var(--text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};
