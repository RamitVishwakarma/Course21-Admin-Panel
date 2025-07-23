export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];

  // Role hierarchy
  level: number; // Higher number = more permissions
  parentRoleId?: string;

  // System roles
  isSystemRole: boolean; // Cannot be deleted
  isDefault: boolean; // Default role for new users

  // Stats
  userCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string; // e.g., 'courses', 'users', 'analytics'

  // Permission hierarchy
  parentPermissionId?: string;
  children?: Permission[];

  // System permissions
  isSystemPermission: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormData {
  name: string;
  code: string;
  description: string;
  permissions: string[];
  level: number;
  parentRoleId?: string;
}

export interface PermissionCategory {
  name: string;
  code: string;
  permissions: Permission[];
}

export interface RoleStats {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  mostAssignedRole: Role | null;
}
