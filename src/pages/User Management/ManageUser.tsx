import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import Loader from '../../components/ui/loader';
import CreateUser from './CreateUser';
import BulkOperations from './BulkOperations';
import { useUserStore } from '../../store/useUserStore';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageUser = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { users, fetchUsers, fetchRoles } = useUserStore();

  useEffect(() => {
    // Load data from localStorage or JSON on first render
    fetchUsers();
    fetchRoles();
    setLoading(false);
  }, []); // Empty dependency array - functions are stable due to Zustand persist

  // Refresh function for child components
  const refreshPage = () => {
    // Data is already in localStorage, no need to fetch again
    // Just trigger a re-render if needed
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map((user) => user.id) : []);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        {/* Bulk Operations */}
        <BulkOperations
          selectedUsers={selectedUsers}
          onClearSelection={clearSelection}
          refreshPage={refreshPage}
        />

        <div className="max-w-full overflow-x-auto">
          {/* Create a user route popup */}
          <div className="text-end pb-6">
            <CreateUser refreshPage={refreshPage} />
          </div>

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4"
                  />
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  User
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Role
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Enrolled Courses
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.isActive !== undefined) // Filter out deleted users
                .map((user) => (
                  <tr key={user.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) =>
                          handleUserSelect(user.id, e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium text-black dark:text-white">
                            {user.name || user.username}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className="text-black dark:text-white">
                        {user.roleName}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          user.isActive
                            ? 'bg-success bg-opacity-10 text-success'
                            : 'bg-warning bg-opacity-10 text-warning'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex flex-col">
                        <span className="text-sm text-black dark:text-white font-medium">
                          {user.coursesEnrolled || 0} courses
                        </span>
                        {user.enrolledCourses &&
                          user.enrolledCourses.length > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {user.enrolledCourses.slice(0, 2).join(', ')}
                              {user.enrolledCourses.length > 2 &&
                                ` +${user.enrolledCourses.length - 2} more`}
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="hover:text-primary"
                          title="View User Dashboard"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                'Are you sure you want to delete this user?',
                              )
                            ) {
                              // Handle deletion - would need to implement deleteUser in store
                              refreshPage();
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Delete User"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
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

export default ManageUser;
