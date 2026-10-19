import { Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/auth/AuthProvider';

export function AppLayout() {
  const { user, activeSatker, selectSatker, logout } = useAuth();
  const multiple = (user?.satkers.length ?? 0) > 1;

  return (
    <div className="shell">
      <header className="topbar">
        <strong>SIMRIS Admin Satker</strong>
        <div className="topbar-right">
          {multiple ? (
            <label>
              Satker{' '}
              <select value={activeSatker?.id ?? ''} onChange={(e) => selectSatker(Number(e.target.value))}>
                {user?.satkers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span>{activeSatker?.nama}</span>
          )}
          <button type="button" onClick={() => void logout()}>
            Keluar
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}