import axios, { AxiosError } from 'axios';
import { session } from './session';
import type { ValidationErrorBody } from './types';

export const api = axios.create({
  baseURL: '/api/v1/satker',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = session.getToken();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);

  const satkerId = session.getSatkerId();
  if (satkerId !== null) config.headers.set('X-Satker-Id', String(satkerId));

  return config;
});

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginCall = error.config?.url?.endsWith('/login');
    if (error.response?.status === 401 && !isLoginCall) onUnauthorized?.();
    return Promise.reject(error);
  },
);

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError<ValidationErrorBody>(error)) {
    if (!error.response) return 'Tidak dapat terhubung ke server.';
    return error.response.data?.message ?? 'Terjadi kesalahan pada server.';
  }
  return 'Terjadi kesalahan.';
}

export function fieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError<ValidationErrorBody>(error) || error.response?.status !== 422) return {};
  const raw = error.response.data?.errors ?? {};
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([, messages]) => messages.length > 0)
      .map(([field, messages]) => [field, messages[0]]),
  );
}