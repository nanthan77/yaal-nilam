export type PublicUserType = 'buyer' | 'seller' | 'agent';

const GOOGLE_REDIRECT_USER_TYPE_KEY = 'yaal-nilam-google-user-type';

export function normalizePublicUserType(value?: string | null): PublicUserType {
  return value === 'seller' || value === 'agent' || value === 'buyer' ? value : 'buyer';
}

export function rememberGoogleRedirectUserType(userType: PublicUserType) {
  try {
    window.sessionStorage.setItem(
      GOOGLE_REDIRECT_USER_TYPE_KEY,
      normalizePublicUserType(userType)
    );
  } catch {
    // Firebase reports the actionable storage error if redirect auth cannot continue.
  }
}

export function readGoogleRedirectUserType(defaultUserType: PublicUserType = 'buyer') {
  try {
    return normalizePublicUserType(
      window.sessionStorage.getItem(GOOGLE_REDIRECT_USER_TYPE_KEY) || defaultUserType
    );
  } catch {
    return normalizePublicUserType(defaultUserType);
  }
}

export function clearGoogleRedirectUserType() {
  try {
    window.sessionStorage.removeItem(GOOGLE_REDIRECT_USER_TYPE_KEY);
  } catch {
    // No redirect marker remains accessible when storage is unavailable.
  }
}

export function hasPendingGoogleRedirect() {
  try {
    return Boolean(window.sessionStorage.getItem(GOOGLE_REDIRECT_USER_TYPE_KEY));
  } catch {
    return false;
  }
}
