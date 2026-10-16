export interface CustomerProfile {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string | null;
}

export interface AuthSession {
  token: string;
  tokenType: string;
  expiresAt: number;
  customer: CustomerProfile;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

interface LoginData {
  token: string;
  tokenType: string;
  expiresIn: number;
  customer: CustomerProfile;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

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

function isLoginData(value: unknown): value is LoginData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.token === 'string' &&
    typeof data.tokenType === 'string' &&
    typeof data.expiresIn === 'number' &&
    data.expiresIn > 0 &&
    isCustomerProfile(data.customer)
  );
}

async function readApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error('Server mengirim respons yang tidak valid.');
  }

  if (typeof body !== 'object' || body === null) {
    throw new Error('Server mengirim respons yang tidak valid.');
  }

  const payload = body as Record<string, unknown>;
  return {
    success: payload.success === true,
    message: typeof payload.message === 'string' ? payload.message : '',
    data: (payload.data ?? null) as T | null,
  };
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await readApiResponse<LoginData>(response);

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Login gagal (HTTP ${response.status}).`);
  }
  if (!isLoginData(result.data)) {
    throw new Error('Server mengirim data login dengan format yang tidak valid.');
  }

  return {
    token: result.data.token,
    tokenType: result.data.tokenType,
    expiresAt: Date.now() + result.data.expiresIn,
    customer: result.data.customer,
  };
}
