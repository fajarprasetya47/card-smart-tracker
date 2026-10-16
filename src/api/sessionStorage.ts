import type { AuthSession, CustomerProfile } from './auth';

const sessionStorageKey = 'card-smart-tracker.auth-session';

function isCustomerProfile(value: unknown): value is CustomerProfile {
  if (typeof value !== 'object' || value === null) return false;
  const profile = value as Record<string, unknown>;
  return (
    typeof profile.id === 'number' &&
    typeof profile.email === 'string' &&
    typeof profile.fullName === 'string' &&
    (typeof profile.phoneNumber === 'string' || profile.phoneNumber === null)
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) return false;
  const session = value as Record<string, unknown>;
  return (
    typeof session.token === 'string' &&
    typeof session.tokenType === 'string' &&
    typeof session.expiresAt === 'number' &&
    isCustomerProfile(session.customer)
  );
}

export function readAuthSession(): AuthSession | null {
  const storedSession = sessionStorage.getItem(sessionStorageKey);
  if (!storedSession) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedSession);
  } catch {
    sessionStorage.removeItem(sessionStorageKey);
    return null;
  }

  if (!isAuthSession(parsed) || parsed.expiresAt <= Date.now()) {
    sessionStorage.removeItem(sessionStorageKey);
    return null;
  }

  return parsed;
}

export function saveAuthSession(session: AuthSession): void {
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(sessionStorageKey);
}
