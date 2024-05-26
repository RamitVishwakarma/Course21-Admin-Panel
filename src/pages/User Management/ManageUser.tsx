import { useEffect, useState } from 'react';
import User from '../../interfaces/Users';
import Role from '../../interfaces/Roles';
import axios from 'axios';
import DefaultLayout from '../../layout/DefaultLayout';
import Loader from '../../common/Loader';
import { SelectRole } from './Select';
import CreateUser from './CreateUser';
import DeleteUser from './DeleteUser';

const ManageUser = () => {
  const [users, setUsers] = useState<User[]>();
  const [roles, setRoles] = useState<Role[]>();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const refreshPage = () => {
    setRefresh(!refresh);
  };
  //getting all users
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}users`)
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  //getting roles
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}roles`)
      .then((res) => {
        // console.log(res.data);
        setRoles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
        <div className="max-w-full overflow-x-auto">
          {/* Create a user route popup */}
          <div className="text-end pb-6">
            {roles ? (
              <CreateUser refreshPage={refreshPage} roles={roles} />
            ) : null}
          </div>
          <table className="w-full table-auto">
            <thead className="text-xl">
              <tr className="bg-gray-2 text-left dark:bg-meta-4 ">
                <th className="min-w-[200px]  py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  User
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Created At
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Updated At
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  Role
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  Set Role
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="[&>*:nth-child(even)]:bg-gray-2 dark:[&>*:nth-child(even)]:bg-meta-4 ">
              {users?.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex gap-4 items-center">
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {user.username}
                        </h5>
                        <p className="text-sm">Email: {user.email}</p>
                        <p className="text-sm">Name: {user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white text-start">
                      {new Date(user.registered).toLocaleString(
                        'en-IN',
                        dateOptions,
                      )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white text-start">
                      {new Date(user.last_login).toLocaleString(
                        'en-IN',
                        dateOptions,
                      )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 text-sm font-medium `}
                    >
                      {user.role_id
                        ? (() => {
                            const role = roles?.find(
                              (role) => role.id === user.role_id,
                            );
                            return role ? role.name : 'Role not found';
                          })()
                        : 'Not set'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {roles ? (
                      <SelectRole
                        roles={roles}
                        selected_option={(() => {
                          const role = roles?.find(
                            (role) => role.id === user.role_id,
                          );
                          return role ? role.name : 'Select a Role';
                        })()}
                        userId={user.id}
                        refreshPage={refreshPage}
                      />
                    ) : (
                      'loading'
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <DeleteUser userId={user.id} refreshPage={refreshPage} />
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
