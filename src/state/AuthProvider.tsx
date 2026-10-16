import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { login as loginRequest, type AuthSession } from '../api/auth';
import { clearAuthSession, readAuthSession, saveAuthSession } from '../api/sessionStorage';

interface AuthContextValue {
  session: AuthSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession());

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await loginRequest(email, password);
    saveAuthSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  useEffect(() => {
    if (!session) return;
    const timeRemaining = session.expiresAt - Date.now();
    if (timeRemaining <= 0) {
      logout();
      return;
    }
    const timeout = window.setTimeout(logout, timeRemaining);
    return () => window.clearTimeout(timeout);
  }, [session, logout]);

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
