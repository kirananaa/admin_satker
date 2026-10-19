import type { RouteObject } from 'react-router-dom';
import { RequireRole } from '@/shared/auth/RequireRole';
import { AppLayout } from './layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SatkerPickerPage } from './pages/SatkerPickerPage';

export const satkerRoutes: RouteObject[] = [
  { path: '/satker/login', element: <LoginPage /> },
  {
    path: '/satker',
    element: (
      <RequireRole role="ADMIN_SATKER" loginPath="/satker/login" pickSatker={<SatkerPickerPage />}>
        <AppLayout />
      </RequireRole>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
];