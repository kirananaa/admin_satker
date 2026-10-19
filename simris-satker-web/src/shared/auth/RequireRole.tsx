import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface Props {
  role: 'ADMIN_SATKER';
  loginPath: string;
  pickSatker: ReactNode;
  children: ReactNode;
}

export function RequireRole({ role, loginPath, pickSatker, children }: Props) {
  const { status, user, activeSatker } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <p role="status">Memuat sesi…</p>;

  if (status === 'anonymous' || !user) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (user.role !== role) return <p role="alert">Akun Anda tidak memiliki akses ke area ini.</p>;

  if (!activeSatker) return <>{pickSatker}</>;

  return <>{children}</>;
}