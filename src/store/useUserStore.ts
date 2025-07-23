import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleUsers } from '../data/sample/users';
import { sampleRoles, samplePermissions } from '../data/sample/roles';
import { type User } from '../types';
import { Role } from '../types/Roles';
import permissionsData, { type Permission } from '../data/permissions';

// Re-export types for convenience
export type { User, Role, Permission };

interface UserStore {
  // Current user (authentication)
  user: User | null;

  // User management
  users: User[];
  roles: Role[];
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;

  // Authentication operations
  setUser: (user: User) => void;
  clearUser: () => void;

  // Fetch operations
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => User | undefined;
  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;

  // User CRUD operations
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  enrollUserInCourse: (userId: string, courseId: string) => Promise<void>;

  // Role operations
  addRole: (roleData: Omit<Role, 'id'>) => void;
  updateRole: (id: string, roleData: Partial<Role>) => void;
  deleteRole: (id: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Authentication state
      user: null,

      // User management state
      users: [],
      roles: [],
      permissions: [],
      isLoading: false,
      error: null,

      // Authentication operations
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      fetchUsers: async () => {
        const currentUsers = get().users;
        if (currentUsers.length === 0) {
          // First load: populate from JSON file with enrolled courses initialization
          const usersWithEnrollment = sampleUsers.map((user) => ({
            ...user,
            enrolledCourses: user.enrolledCourses || [],
          }));
          set({ users: usersWithEnrollment, isLoading: false });
        }
        // Subsequent calls do nothing - data already in localStorage
      },

      fetchUserById: (id) => {
        const users = get().users;
        return users.find((user) => user.id === id);
      },

      fetchRoles: async () => {
        const currentRoles = get().roles;
        if (currentRoles.length === 0) {
          // First load: populate from sampleRoles
          set({ roles: sampleRoles, isLoading: false });
        }
        // Subsequent calls do nothing - data already in localStorage
      },

      fetchPermissions: async () => {
        const currentPermissions = get().permissions;
        if (currentPermissions.length === 0) {
          // First load: populate from JSON file
          set({ permissions: permissionsData, isLoading: false });
        }
        // Subsequent calls do nothing - data already in localStorage
      },

      addUser: (userData) => {
        const users = get().users;
        // Generate new string ID
        const existingIds = users.map(
          (user) => parseInt(user.id.replace('user-', '')) || 0,
        );
        const newIdNumber = Math.max(0, ...existingIds) + 1;
        const newId = `user-${newIdNumber}`;
        const isoDate = new Date().toISOString();

        const newUser: User = {
          id: newId,
          ...userData,
          createdAt: isoDate,
          updatedAt: isoDate,
        };

        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      updateUser: async (id, userData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));

          const isoDate = new Date().toISOString();
          set((state) => ({
            users: state.users.map((user) =>
              user.id === id
                ? { ...user, ...userData, updatedAt: isoDate }
                : user,
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to update user:', error);
          set({ error: 'Failed to update user', isLoading: false });
          throw error;
        }
      },

      deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));

          // For soft delete, we can just set isActive to false
          set((state) => ({
            users: state.users.map((user) =>
              user.id === id
                ? {
                    ...user,
                    isActive: false,
                    updatedAt: new Date().toISOString(),
                  }
                : user,
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to delete user:', error);
          set({ error: 'Failed to delete user', isLoading: false });
          throw error;
        }
      },

      enrollUserInCourse: async (userId, courseId) => {
        try {
          set({ isLoading: true });

          set((state) => ({
            users: state.users.map((user) => {
              if (user.id === userId) {
                const currentEnrollments = user.enrolledCourses || [];

                // Check if user is already enrolled
                if (currentEnrollments.includes(courseId)) {
                  console.log(
                    `User ${userId} is already enrolled in course ${courseId}`,
                  );
                  return user; // No changes if already enrolled
                }

                return {
                  ...user,
                  coursesEnrolled: (user.coursesEnrolled || 0) + 1,
                  enrolledCourses: [...currentEnrollments, courseId],
                  updatedAt: new Date().toISOString(),
                };
              }
              return user;
            }),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to enroll user in course:', error);
          set({ error: 'Failed to enroll user in course', isLoading: false });
          throw error;
        }
      },

      addRole: (roleData) => {
        const roles = get().roles;
        // Generate new string id
        const existingIds = roles.map(
          (role) => parseInt((role.id || '').replace('role-', '')) || 0,
        );
        const newIdNumber = Math.max(0, ...existingIds) + 1;
        const newId = `role-${newIdNumber}`;
        const now = new Date().toISOString();
        const newRole: Role = {
          id: newId,
          createdAt: now,
          updatedAt: now,
          userCount: 0,
          isSystemRole: false,
          isDefault: false,
          level: 1,
          code: '',
          description: '',
          permissions: [],
          ...roleData,
        };
        set((state) => ({
          roles: [...state.roles, newRole],
        }));
      },

      updateRole: (id, roleData) => {
        set((state) => ({
          roles: state.roles.map((role) =>
            role.id === id
              ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
              : role,
          ),
        }));
      },

      deleteRole: (id) => {
        set((state) => ({
          roles: state.roles.filter((role) => role.id !== id),
        }));
      },
    }),
    {
      name: 'user-store', // localStorage key
    },
  ),
);
