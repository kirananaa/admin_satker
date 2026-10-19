export interface Satker {
  id: number;
  kode: string;
  nama: string;
}

export interface SatkerUser {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN_SATKER';
  satkers: Satker[];
}

export interface LoginResponse {
  token: string;
  expires_at: string | null;
  user: SatkerUser;
}

export interface ValidationErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}