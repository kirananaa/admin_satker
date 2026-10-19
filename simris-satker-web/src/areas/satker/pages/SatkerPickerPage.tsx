import { useAuth } from '@/shared/auth/AuthProvider';

export function SatkerPickerPage() {
  const { user, selectSatker, logout } = useAuth();

  return (
    <main className="login">
      <h1>Pilih satker</h1>
      <p>Akun Anda terdaftar pada lebih dari satu satker. Pilih satker yang akan dikelola.</p>
      <ul className="picker">
        {user?.satkers.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => selectSatker(s.id)}>
              {s.nama} <small>({s.kode})</small>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="link" onClick={() => void logout()}>
        Keluar
      </button>
    </main>
  );
}