export const formatSignupError = (err: any): string => {
  if (!err) return 'Registration failed. Please try again.';
  const code = String(err.code || '').toLowerCase();
  const raw = String(err.message || '').toLowerCase();

  if (code.includes('email-already-in-use') || raw.includes('email-already-in-use') || raw.includes('already registered')) {
    return 'This email address is already registered. Please sign in instead.';
  }
  if (code.includes('username-already-in-use') || raw.includes('username is already taken')) {
    return 'This username is already taken. Please choose another username.';
  }
  if (code.includes('invalid-email') || raw.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('weak-password') || raw.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('network-request-failed') || raw.includes('network')) {
    return 'Internet connection error. Please check your network.';
  }
  if (raw.includes('firebase') || raw.includes('credential')) {
    return 'Registration could not be completed right now. Please try again.';
  }
  if (raw.includes('auth/') || raw.includes('error (')) {
    return 'Registration failed. Please check your details and try again.';
  }
  return err.message || 'Registration failed. Please try again.';
};
