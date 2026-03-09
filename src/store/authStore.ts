import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Usuario administrador por defecto
const defaultAdmin: User = {
  id: 'admin-1',
  email: 'admin@supermarket.com',
  name: 'Administrador Principal',
  role: 'admin',
  isActive: true,
  createdAt: new Date()
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulación de login - en producción conectarías con tu backend
        if (email === 'admin@supermarket.com' && password === 'admin123') {
          set({ user: defaultAdmin, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);