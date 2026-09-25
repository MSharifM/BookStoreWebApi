export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  rePassword: string;
}

export interface RegisterResponse {
  isSuccess: boolean;
  errorMessage: string | null;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  errorMessage: string | null;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  userName: string;
  fullName?: string;
  roles: string[];
}