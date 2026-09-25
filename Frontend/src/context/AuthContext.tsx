import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '@/services/authService';
import { tokenStorage } from '@/services/tokenStorage';
import type { AuthUser, LoginRequest } from '@/types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest, remember?: boolean) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => tokenStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    tokenStorage.isAuthenticated(),
  );

  const login = useCallback(
    async (payload: LoginRequest, remember = true): Promise<AuthUser | null> => {
      const nextUser = await authService.login(payload, remember);
      setUser(nextUser);
      setIsAuthenticated(true);
      return nextUser;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}