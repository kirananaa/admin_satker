const TOKEN_KEY = 'simris.satker.token';
const SATKER_KEY = 'simris.satker.active';

let memoryToken: string | null = null;
let memorySatker: number | null = null;

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    /* penyimpanan tidak tersedia: tetap berjalan dari memori */
  }
}

export const session = {
  getToken(): string | null {
    return memoryToken ?? read(TOKEN_KEY);
  },
  setToken(token: string | null): void {
    memoryToken = token;
    write(TOKEN_KEY, token);
  },
  getSatkerId(): number | null {
    if (memorySatker !== null) return memorySatker;
    const raw = read(SATKER_KEY);
    return raw && /^\d+$/.test(raw) ? Number(raw) : null;
  },
  setSatkerId(id: number | null): void {
    memorySatker = id;
    write(SATKER_KEY, id === null ? null : String(id));
  },
  clear(): void {
    memoryToken = null;
    memorySatker = null;
    write(TOKEN_KEY, null);
    write(SATKER_KEY, null);
  },
};