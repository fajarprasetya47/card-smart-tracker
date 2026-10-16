import { readAuthSession } from './sessionStorage';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = readAuthSession();
  if (!session) throw new Error('Sesi login tidak tersedia. Silakan login kembali.');

  const headers = new Headers(init.headers);
  headers.set('Authorization', `${session.tokenType} ${session.token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Tidak dapat terhubung ke backend. Pastikan server backend berjalan.');
    }
    throw error;
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error('Backend mengirim respons yang tidak valid.');
  }

  if (typeof body !== 'object' || body === null) {
    throw new Error('Backend mengirim respons dengan format yang tidak valid.');
  }

  const payload = body as ApiResponse;
  if (!response.ok || payload.success !== true) {
    const detailMessages = typeof payload.data === 'object' && payload.data !== null
      ? Object.values(payload.data).filter((value): value is string => typeof value === 'string')
      : [];
    const message = typeof payload.message === 'string' ? payload.message : '';
    const errorMessage = detailMessages.length > 0
      ? [message, ...detailMessages].filter(Boolean).join(': ')
      : message || `Permintaan gagal (HTTP ${response.status}).`;
    throw new ApiError(errorMessage, response.status);
  }
  if (!('data' in payload) || payload.data === null || payload.data === undefined) {
    throw new Error('Backend tidak mengirim data yang diharapkan.');
  }

  return payload.data as T;
}
