import { useAuth } from '@/shared/auth/AuthProvider';

const MODULES = [
  { name: 'Unit organisasi', phase: 'Fase 2' },
  { name: 'Pegawai dan penempatan', phase: 'Fase 2' },
  { name: 'User, role, dan log audit', phase: 'Fase 3' },
  { name: 'Aset dan penugasan', phase: 'Fase 4' },
  { name: 'Dokumen dan lampiran', phase: 'Fase 5' },
  { name: 'SOP dan kontrol internal', phase: 'Fase 6' },
];

export function DashboardPage() {
  const { user, activeSatker } = useAuth();

  return (
    <section>
      <h1>Beranda</h1>
      <p>
        Masuk sebagai <strong>{user?.username}</strong>, mengelola <strong>{activeSatker?.nama}</strong>.
      </p>
      <h2>Modul</h2>
      <ul className="modules">
        {MODULES.map((m) => (
          <li key={m.name}>
            {m.name} <small>{m.phase}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}