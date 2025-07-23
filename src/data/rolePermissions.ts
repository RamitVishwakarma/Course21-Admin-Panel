export interface RolePermission {
  roleId: number;
  permissionId: number;
}

// Define which permissions are assigned to which roles
const rolePermissionsData: RolePermission[] = [
  // Admin role (id: 1) has all permissions
  { roleId: 1, permissionId: 1 }, // Create course
  { roleId: 1, permissionId: 3 }, // Manage courses
  { roleId: 1, permissionId: 4 }, // Create User
  { roleId: 1, permissionId: 5 }, // Manage Users
  { roleId: 1, permissionId: 6 }, // View Reports

  // Student role (id: 2) has limited permissions
  { roleId: 2, permissionId: 1 }, // Create course (for demo purposes)
  { roleId: 2, permissionId: 6 }, // View Reports
];

export default rolePermissionsData;

// Helper function to get permissions for a specific role
export const getPermissionsForRole = (
  roleId: number,
  allPermissions: any[],
  rolePermissions = rolePermissionsData,
) => {
  const permissionIds = rolePermissions
    .filter((rp) => rp.roleId === roleId)
    .map((rp) => rp.permissionId);

  return allPermissions.filter((permission) =>
    permissionIds.includes(permission.id),
  );
};
