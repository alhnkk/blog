// BetterAuth specific types
export interface BetterAuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface BetterAuthSession {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}

export interface BetterAuthAccount {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContext {
  user: BetterAuthUser | null;
  session: BetterAuthSession | null;
  isLoading: boolean;
  error: string | null;
}

// Auth form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

// OAuth provider types
export type OAuthProvider = "github" | "google";

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scope?: string[];
}

// Auth middleware types
export interface AuthMiddlewareConfig {
  publicRoutes: string[];
  authRoutes: string[];
  adminRoutes: string[];
  defaultRedirect: string;
  loginRedirect: string;
}

// Session management types
export interface SessionOptions {
  maxAge?: number;
  updateAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

// Auth error types
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "USER_NOT_FOUND"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "SESSION_EXPIRED"
  | "OAUTH_ERROR"
  | "VERIFICATION_REQUIRED";
