export const formatAuthError = (err: any): string => {
  if (!err) return 'Login failed. Please check your credentials.';
  const code = String(err.code || '').toLowerCase();
  const raw = String(err.message || '').toLowerCase();

  // Short email verification required message
  if (
    code.includes('email-not-verified') ||
    raw.includes('email not verified') ||
    raw.includes('not verified')
  ) {
    return 'Email not verified. Please verify your email.';
  }

  // Strictly NO "Please try again" for incorrect email/username/password
  if (
    code.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    code.includes('user-not-found') ||
    raw.includes('invalid-credential') ||
    raw.includes('wrong-password') ||
    raw.includes('user-not-found') ||
    raw.includes('invalid credential')
  ) {
    return 'Incorrect email/username or password';
  }

  if (code.includes('invalid-email') || raw.includes('invalid-email') || raw.includes('badly formatted')) {
    return 'Please enter a valid email address.';
  }

  if (code.includes('too-many-requests') || raw.includes('too-many-requests')) {
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  }

  if (code.includes('network-request-failed') || raw.includes('network') || raw.includes('offline')) {
    return 'Internet connection error. Please check your network.';
  }

  if (code.includes('user-disabled') || raw.includes('user-disabled')) {
    return 'This account has been deactivated. Please contact support.';
  }

  if (raw.includes('firebase') || raw.includes('credential') || raw.includes('api key')) {
    return 'Incorrect email/username or password';
  }

  if (raw.includes('auth/') || raw.includes('error (')) {
    return 'Incorrect email/username or password';
  }

  return err.message || 'Login failed. Please check your credentials.';
};

export const formatResetError = (err: any): string => {
  if (!err) return 'Unable to send reset link.';
  const code = String(err.code || '').toLowerCase();
  const raw = String(err.message || '').toLowerCase();

  if (
    code.includes('user-not-found') ||
    raw.includes('user-not-found') ||
    raw.includes('no account found')
  ) {
    return err.message || 'No account found with this email or username.';
  }
  if (code.includes('invalid-email') || raw.includes('invalid-email')) {
    return 'Please enter a valid email or username.';
  }
  if (code.includes('network-request-failed') || raw.includes('network')) {
    return 'Internet connection error. Please check your network.';
  }
  if (raw.includes('firebase')) {
    return 'Unable to process request right now. Please try again.';
  }
  return err.message || 'Failed to send reset link. Please check and try again.';
};
