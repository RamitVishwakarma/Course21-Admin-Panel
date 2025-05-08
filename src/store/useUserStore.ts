import { create } from 'zustand';
import userData from '../data/userData';
import rolesData from '../data/roles';

export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  username: string;
  status: number;
  verified: number;
  roles_mask: number;
  registered: number;
  role_id: number;
  last_login: number;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

interface UserStore {
  users: User[];
  roles: Role[];
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchUsers: () => void;
  fetchUserById: (id: number) => User | undefined;
  fetchRoles: () => void;

  // User CRUD operations
  addUser: (userData: Omit<User, 'id' | 'registered' | 'last_login'>) => void;
  updateUser: (id: number, userData: Partial<User>) => void;
  deleteUser: (id: number) => void;

  // Role operations
  addRole: (roleData: Omit<Role, 'id'>) => void;
  updateRole: (id: number, roleData: Partial<Role>) => void;
  deleteRole: (id: number) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  roles: [],
  isLoading: false,
  error: null,

  fetchUsers: () => {
    set({ isLoading: true, error: null });
    try {
      // Instead of API call, use the local dummy data
      set({ users: userData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch users', isLoading: false });
    }
  },

  fetchUserById: (id) => {
    return get().users.find((user) => user.id === id);
  },

  fetchRoles: () => {
    set({ isLoading: true, error: null });
    try {
      set({ roles: rolesData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch roles', isLoading: false });
    }
  },

  addUser: (userData) => {
    const newId = Math.max(0, ...get().users.map((user) => user.id)) + 1;
    const now = Math.floor(Date.now() / 1000); // Unix timestamp
    const isoDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newUser: User = {
      id: newId,
      ...userData,
      registered: now,
      last_login: now,
      created_at: isoDate,
      updated_at: null,
      deleted_at: null,
    };

    set((state) => ({
      users: [...state.users, newUser],
    }));
  },

  updateUser: (id, userData) => {
    const isoDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...userData, updated_at: isoDate } : user,
      ),
    }));
  },

  deleteUser: (id) => {
    const isoDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, deleted_at: isoDate } : user,
      ),
    }));
  },

  addRole: (roleData) => {
    const newId = Math.max(0, ...get().roles.map((role) => role.id)) + 1;

    const newRole: Role = {
      id: newId,
      ...roleData,
    };

    set((state) => ({
      roles: [...state.roles, newRole],
    }));
  },

  updateRole: (id, roleData) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id ? { ...role, ...roleData } : role,
      ),
    }));
  },

  deleteRole: (id) => {
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
    }));
  },
}));
