import DefaultLayout from '@/layout/DefaultLayout';
import Loader from '../../components/ui/loader';
import { useEffect, useState } from 'react';
import EditRole from './EditRole';
import { useUserStore } from '@/store/useUserStore';
import { samplePermissions } from '@/data/sample/roles';
import { PlusIcon } from '@heroicons/react/24/outline';

const ManageRole = () => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const roles = useUserStore((state) => state.roles);
  const permissions = samplePermissions;
  const fetchRoles = useUserStore((state) => state.fetchRoles);
  const fetchPermissions = useUserStore((state) => state.fetchPermissions);
  const addRole = useUserStore((state) => state.addRole);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    // Simulate loading delay for UI consistency
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [fetchRoles, fetchPermissions, refresh]);

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const handleCreateRole = () => {
    if (newRoleName.trim()) {
      // Add the new role to the store
      addRole({
        name: newRoleName.trim(),
        code: newRoleName.trim().toLowerCase().replace(/\s+/g, '_'),
        description: '',
        permissions: [],
        level: 1,
        isSystemRole: false,
        isDefault: false,
        userCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setNewRoleName('');
      setShowCreateForm(false);
      setRefresh((r) => !r); // Refresh the table
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* Create Role Section */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Role Management
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            <PlusIcon className="h-4 w-4" />
            Create Role
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 p-4 border border-stroke dark:border-strokedark rounded bg-gray-50 dark:bg-meta-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Enter role name..."
                  className="w-full px-3 py-2 border border-stroke dark:border-strokedark rounded bg-white dark:bg-boxdark text-black dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateRole}
                  disabled={!newRoleName.trim()}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewRoleName('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          {/* Add a create Role here */}
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Role
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Assigned Permissions
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&>*:nth-child(even)]:bg-gray-2 dark:[&>*:nth-child(even)]:bg-meta-4 ">
              {roles.map((role, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-2xl text-black dark:text-white">
                      {role.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((permCode, permIndex) => {
                        const perm = permissions.find(
                          (p) => (p as any).code === permCode,
                        );
                        return perm ? (
                          <div key={permIndex} className="mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {perm.name}
                            </span>
                          </div>
                        ) : null;
                      })
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                        No permissions assigned
                      </span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5 ml-4">
                      <EditRole
                        role={role}
                        permissions={permissions}
                        refreshPage={refreshPage}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageRole;
