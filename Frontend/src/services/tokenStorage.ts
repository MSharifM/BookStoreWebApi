import type { AuthUser } from '@/types/auth';

const KEYS = {
  access: 'bookshelf.auth.access_token',
  refresh: 'bookshelf.auth.refresh_token',
  accessExp: 'bookshelf.auth.access_exp',
  refreshExp: 'bookshelf.auth.refresh_exp',
  user: 'bookshelf.auth.user',
} as const;

type StorageMode = 'local' | 'session';

export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  user?: AuthUser | null;
}

class TokenStorage {
  private mode: StorageMode = 'local';

  private get store(): Storage {
    return this.mode === 'session' ? sessionStorage : localStorage;
  }

  private get alternate(): Storage {
    return this.mode === 'session' ? localStorage : sessionStorage;
  }

  private read(key: string): string | null {
    return this.store.getItem(key) ?? this.alternate.getItem(key);
  }

  /** Detect which storage already holds a session and set the mode accordingly. */
  hydrateMode(): void {
    if (localStorage.getItem(KEYS.access)) {
      this.mode = 'local';
    } else if (sessionStorage.getItem(KEYS.access)) {
      this.mode = 'session';
    }
  }

  getAccessToken(): string | null {
    return this.read(KEYS.access);
  }

  getRefreshToken(): string | null {
    return this.read(KEYS.refresh);
  }

  getAccessTokenExpiresAt(): string | null {
    return this.read(KEYS.accessExp);
  }

  getRefreshTokenExpiresAt(): string | null {
    return this.read(KEYS.refreshExp);
  }

  getUser(): AuthUser | null {
    const raw = this.read(KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  setSession(payload: SessionPayload, remember: boolean): void {
    this.clear();
    this.mode = remember ? 'local' : 'session';
    const s = this.store;

    s.setItem(KEYS.access, payload.accessToken);
    s.setItem(KEYS.refresh, payload.refreshToken);

    if (payload.accessTokenExpiresAt) s.setItem(KEYS.accessExp, payload.accessTokenExpiresAt);
    if (payload.refreshTokenExpiresAt) s.setItem(KEYS.refreshExp, payload.refreshTokenExpiresAt);
    if (payload.user) s.setItem(KEYS.user, JSON.stringify(payload.user));
  }

  updateTokens(
    accessToken: string,
    refreshToken?: string,
    accessTokenExpiresAt?: string,
    refreshTokenExpiresAt?: string,
  ): void {
    const s = this.store;
    s.setItem(KEYS.access, accessToken);
    if (refreshToken) s.setItem(KEYS.refresh, refreshToken);
    if (accessTokenExpiresAt) s.setItem(KEYS.accessExp, accessTokenExpiresAt);
    if (refreshTokenExpiresAt) s.setItem(KEYS.refreshExp, refreshTokenExpiresAt);
  }

  clear(): void {
    for (const s of [localStorage, sessionStorage]) {
      s.removeItem(KEYS.access);
      s.removeItem(KEYS.refresh);
      s.removeItem(KEYS.accessExp);
      s.removeItem(KEYS.refreshExp);
      s.removeItem(KEYS.user);
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }
}

export const tokenStorage = new TokenStorage();
tokenStorage.hydrateMode();