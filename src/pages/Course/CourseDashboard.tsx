import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '../../layout/DefaultLayout';
import { EyeIcon, PencilIcon } from '@heroicons/react/20/solid';
import DeleteCourse from '../../components/DeleteCourse';
import { Link } from 'react-router-dom';

const AllCourses: React.FC = () => {
  interface Course {
    id: number;
    prefix: string | null;
    name: string;
    validity: number | null;
    manager: string | null;
    price: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}courses`)
      .then((res) => {
        setCourses(res.data.data);
        console.log(res.data.data);
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
    timeZone: 'UTC',
  };

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Created At
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Updated At
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Validity
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {course.name}
                    </h5>
                    <p className="text-sm">₹{course.price}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white text-start">
                      {new Date(course.created_at).toLocaleString(
                        'en-IN',
                        dateOptions,
                      )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white text-start">
                      {new Date(course.updated_at).toLocaleString(
                        'en-IN',
                        dateOptions,
                      )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium `}
                    >
                      {course.validity ? course.validity : 'Lifetime'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* View button */}
                      <button className="hover:text-primary">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {/* Delete button */}
                      <DeleteCourse courseId={course.id} />
                      {/* Edit button */}

                      <Link
                        to={`/admin/update-course/${course.id}`}
                        className="hover:text-primary"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
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

export default AllCourses;
