import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/20/solid';
import { Course } from '../../interfaces/Course';
import DefaultLayout from '../../layout/DefaultLayout';
import DeleteCourse from './DeleteCourse';
import CreateCourse from './CreateCourse';
import UpdateCourse from './UpdateCourse';
import axios from 'axios';
import Loader from '../../common/Loader';

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //refresh page logic
  const [refresh, setRefresh] = useState(false);
  const refreshPage = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}courses`)
      .then((res) => {
        console.log(res.data.data);
        setCourses(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

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
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {/* Create a course route cum popup */}
          <div className="text-end ">
            <CreateCourse refreshPage={refreshPage} />
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Course
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
                    <div className="flex gap-4">
                      {course.image_path ? (
                        <img
                          className="h-12.5 w-15 rounded-md"
                          src={course.image_path}
                        />
                      ) : null}
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {course.name}
                        </h5>
                        <p className="text-sm">₹{course.price}</p>
                      </div>
                    </div>
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
                      {course.validity ? course.validity : 'Not set'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* View button */}
                      <Link
                        to={`/admin/view-course/${course.id}`}
                        className="hover:text-primary"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      {/* Delete button */}
                      <DeleteCourse
                        courseId={course.id}
                        refresh={refreshPage}
                      />
                      {/* Update button */}
                      <UpdateCourse
                        courseId={course.id}
                        name={course.name}
                        image_path={course.image_path}
                        refresh={refreshPage}
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

export default AllCourses;
