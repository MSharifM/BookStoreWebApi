import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';
import { AuthServiceError } from '@/utils/errors';
import { decodeJwt } from '@/utils/jwt';
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth';

function mapClaimsToUser(accessToken: string): AuthUser | null {
  const claims = decodeJwt(accessToken);
  if (!claims) return null;

  const rawRoles = claims.role;
  const roles = Array.isArray(rawRoles)
    ? rawRoles
    : typeof rawRoles === 'string'
      ? [rawRoles]
      : [];

  return {
    id: (claims.sub as string) ?? '',
    email: (claims.email as string) ?? '',
    userName: (claims.unique_name as string) ?? '',
    fullName: (claims.name as string) ?? undefined,
    roles,
  };
}

export const authService = {
  /**
   * POST /auth/register
   * Contract: { userName, email, password, rePassword } -> RegisterResponse
   * Does NOT authenticate the user; caller must redirect to /login.
   */
  async register(payload: RegisterRequest): Promise<void> {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', {
      userName: payload.userName,
      email: payload.email,
      password: payload.password,
      rePassword: payload.rePassword,
    });

    // Some backends return HTTP 200 with a business flag.
    if (data && typeof data === 'object' && 'isSuccess' in data && !data.isSuccess) {
      throw new AuthServiceError(data.errorMessage ?? 'ثبت نام ناموفق بود.');
    }
  },

  /** POST /auth/login */
  async login(payload: LoginRequest, remember = true): Promise<AuthUser | null> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', {
      userNameOrEmail: payload.userNameOrEmail,
      password: payload.password,
    });

    if (!data.isSuccess) {
      throw new AuthServiceError(
        data.errorMessage ?? 'ایمیل/نام کاربری یا رمز عبور اشتباه است.',
      );
    }
    if (!data.accessToken || !data.refreshToken) {
      throw new AuthServiceError('پاسخ سرور نامعتبر بود. لطفاً دوباره تلاش کنید.');
    }

    const user = mapClaimsToUser(data.accessToken);

    tokenStorage.setSession(
      {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
        user,
      },
      remember,
    );

    return user;
  },

  /** POST /auth/refresh-token */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const body: RefreshRequest = { refreshToken };
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh-token', body);

    if (!data.isSuccess || !data.accessToken) {
      throw new AuthServiceError(data.errorMessage ?? 'بازنشانی نشست ناموفق بود.');
    }

    tokenStorage.updateTokens(
      data.accessToken,
      data.refreshToken ?? undefined,
      data.accessTokenExpiresAt,
      data.refreshTokenExpiresAt,
    );
    return data;
  },

  /** POST /auth/logout */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch {
      // swallow - clearing tokens is what matters
    } finally {
      tokenStorage.clear();
    }
  },

  isAuthenticated(): boolean {
    return tokenStorage.isAuthenticated();
  },
};