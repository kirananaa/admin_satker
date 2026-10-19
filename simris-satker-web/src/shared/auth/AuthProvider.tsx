import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, setUnauthorizedHandler } from '../api/client';
import { session } from '../api/session';
import type { LoginResponse, Satker, SatkerUser } from '../api/types';

type Status = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  status: Status;
  user: SatkerUser | null;
  activeSatker: Satker | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectSatker: (id: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveActiveSatker(user: SatkerUser): Satker | null {
  const stored = session.getSatkerId();
  const match = user.satkers.find((s) => s.id === stored);
  if (match) return match;
  if (user.satkers.length === 1) return user.satkers[0];
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(session.getToken() ? 'loading' : 'anonymous');
  const [user, setUser] = useState<SatkerUser | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const applyUser = useCallback((next: SatkerUser) => {
    const active = resolveActiveSatker(next);
    session.setSatkerId(active?.id ?? null);
    setActiveId(active?.id ?? null);
    setUser(next);
    setStatus('authenticated');
  }, []);

  const reset = useCallback(() => {
    session.clear();
    setUser(null);
    setActiveId(null);
    setStatus('anonymous');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(reset);
    return () => setUnauthorizedHandler(null);
  }, [reset]);

  useEffect(() => {
    if (!session.getToken()) return;
    let cancelled = false;
    api
      .get<{ user: SatkerUser }>('/me')
      .then((res) => !cancelled && applyUser(res.data.user))
      .catch(() => !cancelled && reset());
    return () => {
      cancelled = true;
    };
  }, [applyUser, reset]);

  const login = useCallback(
    async (loginName: string, password: string) => {
      const res = await api.post<LoginResponse>('/login', { login: loginName, password });
      session.setToken(res.data.token);
      applyUser(res.data.user);
    },
    [applyUser],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      /* token mungkin sudah tidak berlaku; sesi lokal tetap dibersihkan */
    }
    reset();
  }, [reset]);

  const selectSatker = useCallback((id: number) => {
    session.setSatkerId(id);
    setActiveId(id);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      activeSatker: user?.satkers.find((s) => s.id === activeId) ?? null,
      login,
      logout,
      selectSatker,
    }),
    [status, user, activeId, login, logout, selectSatker],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}