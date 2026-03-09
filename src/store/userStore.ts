import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: 'admin-1',
          email: 'admin@supermarket.com',
          name: 'Administrador Principal',
          role: 'admin',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'cashier-1',
          email: 'cajero@supermarket.com',
          name: 'Juan Pérez',
          role: 'cashier',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'manager-1',
          email: 'gerente@supermarket.com',
          name: 'María González',
          role: 'manager',
          isActive: true,
          createdAt: new Date()
        }
      ],
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          createdAt: new Date()
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          )
        }));
      },
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id)
        }));
      },
      getUserById: (id) => {
        return get().users.find((user) => user.id === id);
      }
    }),
    {
      name: 'users-storage'
    }
  )
);