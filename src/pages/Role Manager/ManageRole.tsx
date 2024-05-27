import DefaultLayout from '@/layout/DefaultLayout';
import Loader from '../../common/Loader';
import { useEffect, useState } from 'react';
import Role from '../../interfaces/Roles';
import axios from 'axios';
import Permission from '../../interfaces/Permission';
import { PencilIcon } from 'lucide-react';
import EditRole from './EditRole';

const ManageRole = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  //geting roles
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}roles`)
      .then((res) => {
        setRoles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  //geting permissions
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}permissions`)
      .then((res) => {
        setPermissions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                    {permissions.map((permission, index) => {
                      return (
                        <div key={index}>
                          <h5 className="font-medium text-black dark:text-white">
                            {permission.name}
                          </h5>
                        </div>
                      );
                    })}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5 ml-4">
                      <button className="hover:text-primary">
                        <EditRole role={role} permissions={permissions} />
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

export default ManageRole;
