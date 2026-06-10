import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  phone: string;
}

interface UserAuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  authModal: 'login' | 'signup' | 'profile' | null;
  openLogin: () => void;
  openSignup: () => void;
  openProfile: () => void;
  closeModal: () => void;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, phone: string, password: string) => string | null;
  updateProfile: (name: string, phone: string, currentPassword: string, newPassword?: string) => string | null;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextValue | null>(null);

const SESSION_KEY = 'arf_session';
const USERS_KEY   = 'arf_users';

interface StoredUser extends User { passwordHash: string; }

function hashPassword(p: string) {
  // Simple deterministic hash (not cryptographic — fine for localStorage demo)
  let h = 0;
  for (let i = 0; i < p.length; i++) { h = (Math.imul(31, h) + p.charCodeAt(i)) | 0; }
  return h.toString(36);
}

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  });
  const [authModal, setAuthModal] = useState<'login' | 'signup' | 'profile' | null>(null);

  const openLogin   = useCallback(() => setAuthModal('login'),   []);
  const openSignup  = useCallback(() => setAuthModal('signup'),  []);
  const openProfile = useCallback(() => setAuthModal('profile'), []);
  const closeModal  = useCallback(() => setAuthModal(null),      []);

  const login = useCallback((email: string, password: string): string | null => {
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return 'No account found with this email';
    if (found.passwordHash !== hashPassword(password)) return 'Incorrect password';
    const u: User = { name: found.name, email: found.email, phone: found.phone };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    setAuthModal(null);
    return null;
  }, []);

  const signup = useCallback((name: string, email: string, phone: string, password: string): string | null => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) return 'An account with this email already exists';
    if (!/^\d{10}$/.test(phone)) return 'Enter a valid 10-digit phone number';
    if (password.length < 6) return 'Password must be at least 6 characters';
    const newUser: StoredUser = { name, email, phone, passwordHash: hashPassword(password) };
    saveUsers([...users, newUser]);
    const u: User = { name, email, phone };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    setAuthModal(null);
    return null;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((name: string, phone: string, currentPassword: string, newPassword?: string): string | null => {
    if (!name.trim()) return 'Name cannot be empty';
    if (!/^\d{10}$/.test(phone)) return 'Enter a valid 10-digit phone number';
    const users = getUsers();
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') as User | null;
    if (!session) return 'Not logged in';
    const idx = users.findIndex((u) => u.email.toLowerCase() === session.email.toLowerCase());
    if (idx === -1) return 'Account not found';
    if (users[idx].passwordHash !== hashPassword(currentPassword)) return 'Current password is incorrect';
    users[idx].name = name.trim();
    users[idx].phone = phone;
    if (newPassword) {
      if (newPassword.length < 6) return 'New password must be at least 6 characters';
      users[idx].passwordHash = hashPassword(newPassword);
    }
    saveUsers(users);
    const updated: User = { name: name.trim(), email: session.email, phone };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    setUser(updated);
    return null;
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, isLoggedIn: !!user, authModal, openLogin, openSignup, openProfile, closeModal, login, signup, updateProfile, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
  return ctx;
}
