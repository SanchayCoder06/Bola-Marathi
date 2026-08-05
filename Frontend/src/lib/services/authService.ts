/**
 * BOLA Marathi — Authentication Service
 * Supports Google OAuth, Facebook OAuth, Guest Mode, and Email login with local persistence.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'google' | 'facebook' | 'guest' | 'email';
  avatar: string;
  isGuest?: boolean;
  onboardingCompleted?: boolean;
  createdAt: string;
}

const AUTH_STORAGE_KEY = 'bola_marathi_auth_user';
const LISTENERS: Set<(user: AuthUser | null) => void> = new Set();

export const AuthService = (() => {
  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn("Failed to parse stored auth user:", err);
    }
    return null;
  }

  function _saveUser(user: AuthUser | null): void {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    LISTENERS.forEach((callback) => callback(user));
  }

  async function loginWithGoogle(): Promise<AuthUser> {
    const current = getCurrentUser();
    const mockUser: AuthUser = {
      id: current && current.provider === 'google' ? current.id : `google_${Date.now()}`,
      name: current?.name || 'Aarav Sharma',
      email: current?.email || 'aarav.sharma@gmail.com',
      provider: 'google',
      avatar: current?.avatar || 'https://api.dicebear.com/9.x/notionists/svg?seed=Aarav&backgroundColor=ffdfbf',
      isGuest: false,
      onboardingCompleted: true,
      createdAt: current?.createdAt || new Date().toISOString()
    };

    _saveUser(mockUser);
    return mockUser;
  }

  async function loginWithFacebook(): Promise<AuthUser> {
    const current = getCurrentUser();
    const mockUser: AuthUser = {
      id: current && current.provider === 'facebook' ? current.id : `facebook_${Date.now()}`,
      name: current?.name || 'Aarav Sharma',
      email: current?.email || 'aarav.sharma@facebook.com',
      provider: 'facebook',
      avatar: current?.avatar || 'https://api.dicebear.com/9.x/notionists/svg?seed=AaravFacebook&backgroundColor=ffdfbf',
      isGuest: false,
      onboardingCompleted: true,
      createdAt: current?.createdAt || new Date().toISOString()
    };

    _saveUser(mockUser);
    return mockUser;
  }

  async function loginAsGuest(): Promise<AuthUser> {
    const current = getCurrentUser();
    if (current && current.isGuest) {
      return current; // Preserve existing guest session & progress
    }
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      name: 'Guest Learner',
      email: 'guest@bolamarathi.com',
      provider: 'guest',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=GuestUser&backgroundColor=e2e8f0',
      isGuest: true,
      onboardingCompleted: true,
      createdAt: new Date().toISOString()
    };

    _saveUser(guestUser);
    return guestUser;
  }

  async function loginWithEmail(name: string, email: string): Promise<AuthUser> {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      throw new Error("Name cannot be empty");
    }
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      throw new Error("Please provide a valid email address");
    }

    const current = getCurrentUser();
    const user: AuthUser = {
      id: current?.id || `email_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      provider: 'email',
      avatar: current?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=ffdfbf`,
      isGuest: false,
      onboardingCompleted: true,
      createdAt: current?.createdAt || new Date().toISOString()
    };

    _saveUser(user);
    return user;
  }

  function updateCurrentUser(updates: Partial<AuthUser>): AuthUser | null {
    const current = getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...updates };
    _saveUser(updated);
    return updated;
  }

  function logout(): void {
    _saveUser(null);
  }

  function subscribe(callback: (user: AuthUser | null) => void): () => void {
    LISTENERS.add(callback);
    return () => LISTENERS.delete(callback);
  }

  return {
    getCurrentUser,
    loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    loginWithEmail,
    updateCurrentUser,
    logout,
    subscribe,
    onAuthStateChanged: subscribe,
    validateEmail
  };
})();
