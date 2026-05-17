import { createContext, useContext, useState } from 'react';
import type { UserProfile } from '../types';

// Local user credentials (password hardcoded for demo)
const LOCAL_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'carlos@techcorp.com':  { password: 'admin123',    userId: 'usr-001' },
  'ana@techcorp.com':     { password: 'manager123',  userId: 'usr-002' },
  'pedro@techcorp.com':   { password: 'operator123', userId: 'usr-003' },
  'maria@techcorp.com':   { password: 'viewer123',   userId: 'usr-004' },
  'rafael@techcorp.com':  { password: 'operator123', userId: 'usr-005' },
  // alias shown in demo box
  'admin@rfidmanager.com': { password: 'rfid@2024',  userId: 'usr-001' },
};

const LOCAL_PROFILES: Record<string, UserProfile> = {
  'usr-001': { id: 'usr-001', full_name: 'Carlos Silva',  email: 'carlos@techcorp.com',  role: 'admin',    company_id: 'comp-001', department: 'IT',         status: 'active', created_at: '2023-06-01T00:00:00Z' },
  'usr-002': { id: 'usr-002', full_name: 'Ana Costa',     email: 'ana@techcorp.com',     role: 'manager',  company_id: 'comp-001', department: 'Operations', status: 'active', created_at: '2023-06-15T00:00:00Z' },
  'usr-003': { id: 'usr-003', full_name: 'Pedro Santos',  email: 'pedro@techcorp.com',   role: 'operator', company_id: 'comp-001', department: 'Warehouse',  status: 'active', created_at: '2023-07-01T00:00:00Z' },
  'usr-004': { id: 'usr-004', full_name: 'Maria Lima',    email: 'maria@techcorp.com',   role: 'viewer',   company_id: 'comp-001', department: 'Finance',    status: 'active', created_at: '2023-07-15T00:00:00Z' },
  'usr-005': { id: 'usr-005', full_name: 'Rafael Mendes', email: 'rafael@techcorp.com',  role: 'operator', company_id: 'comp-001', department: 'IT',         status: 'inactive', created_at: '2023-08-01T00:00:00Z' },
};

const SESSION_KEY = 'rfid_session_user_id';

function loadSavedSession(): UserProfile | null {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && LOCAL_PROFILES[saved]) return LOCAL_PROFILES[saved];
  } catch { /* ignore */ }
  return null;
}

interface AuthContextValue {
  session: UserProfile | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  registerUser: (email: string, password: string, profile: Omit<UserProfile, 'id' | 'created_at'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(loadSavedSession);
  const loading = false;

  async function login(email: string, password: string) {
    const key = email.toLowerCase().trim();
    const cred = LOCAL_CREDENTIALS[key];
    if (!cred || cred.password !== password) {
      throw new Error('E-mail ou senha incorretos.');
    }
    const profile = LOCAL_PROFILES[cred.userId];
    if (!profile) throw new Error('Usuário não encontrado.');
    if (profile.status === 'inactive') throw new Error('Conta inativa. Contate o administrador.');
    try { sessionStorage.setItem(SESSION_KEY, profile.id); } catch { /* ignore */ }
    setUserProfile(profile);
  }

  async function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    setUserProfile(null);
  }

  async function resetPassword(_email: string) {
    // In local mode, just simulate success
    return;
  }

  async function registerUser(
    email: string,
    _password: string,
    profile: Omit<UserProfile, 'id' | 'created_at'>
  ) {
    // In local mode, just add to in-memory store
    const newId = `usr-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newId,
      ...profile,
      email,
      created_at: new Date().toISOString(),
    };
    LOCAL_PROFILES[newId] = newProfile;
    LOCAL_CREDENTIALS[email.toLowerCase()] = { password: _password, userId: newId };
  }

  return (
    <AuthContext.Provider value={{
      session: userProfile,
      userProfile,
      loading,
      login,
      logout,
      resetPassword,
      registerUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
