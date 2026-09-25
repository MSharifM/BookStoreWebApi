import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { tokenStorage } from './tokenStorage';
import type { AuthResponse } from '@/types/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7069/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/** Silent client (no interceptors) used exclusively for refreshing tokens. */
const silentClient: AxiosInstance = axios.create({ baseURL, timeout: 15000 });

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    const headers = config.headers as AxiosHeaders;
    headers.set?.('Authorization', `Bearer ${token}`);
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await silentClient.post<AuthResponse>('/auth/refresh-token', {
      refreshToken,
    });

    if (!data.isSuccess || !data.accessToken) {
      tokenStorage.clear();
      return null;
    }

    tokenStorage.updateTokens(
      data.accessToken,
      data.refreshToken ?? undefined,
      data.accessTokenExpiresAt,
      data.refreshTokenExpiresAt,
    );
    return data.accessToken;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh-token', '/auth/logout'];

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status as number | undefined;

    if (
      !config ||
      status !== 401 ||
      config._retry ||
      isAuthEndpoint(config.url)
    ) {
      return Promise.reject(error);
    }

    config._retry = true;
    refreshPromise ??= performRefresh().finally(() => {
      refreshPromise = null;
    });

    const newToken = await refreshPromise;
    if (!newToken) return Promise.reject(error);

    (config.headers as AxiosHeaders)?.set?.('Authorization', `Bearer ${newToken}`);
    return apiClient(config);
  },
);