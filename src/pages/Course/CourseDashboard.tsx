import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/20/solid';
import { Course } from '../../interfaces/Course';
import DefaultLayout from '../../layout/DefaultLayout';
import DeleteCourse from './DeleteCourse';
import CreateCourse from './CreateCourse';
import UpdateCourse from './UpdateCourse';
import Loader from '../../common/Loader';
import { useCourseStore } from '@/store/useCourseStore';

const ITEMS_PER_PAGE = 10; // Number of courses per page

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Get courses from Zustand store
  const { courses: allCourses, fetchCourses } = useCourseStore();

  const getPaginatedCourses = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allCourses.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    // Load courses if they haven't been loaded yet
    if (allCourses.length === 0) {
      fetchCourses();
    } else {
      // Calculate total pages
      setTotalPages(Math.ceil(allCourses.length / ITEMS_PER_PAGE));
      setCourses(getPaginatedCourses());
      setLoading(false);
    }
  }, [allCourses, fetchCourses]);

  // Update displayed courses when page changes
  useEffect(() => {
    setCourses(getPaginatedCourses());
  }, [currentPage, allCourses]);

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
          {/* Create a course route popup */}
          <div className="text-end pb-6">
            <CreateCourse />
          </div>
          <table className="w-full table-auto">
            <thead className="text-xl">
              <tr className="bg-gray-2 text-left dark:bg-meta-4 ">
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
            <tbody className="[&>*:nth-child(even)]:bg-gray-2 dark:[&>*:nth-child(even)]:bg-meta-4 ">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex gap-4 items-center">
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
                      <DeleteCourse courseId={course.id} />
                      {/* Update button */}
                      <UpdateCourse
                        courseId={course.id}
                        name={course.name}
                        image_path={course.image_path}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between items-center mt-5">
        <p className="text-black dark:text-white">
          Showing Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center justify-center gap-2.5 rounded-md bg-black py-4 px-10 text-center font-medium text-white hover:bg-opacity-60 disabled:opacity-50 lg:px-8 xl:px-10"
          >
            <BackwardIcon className="h-5 w-5" />
            <span>Previous</span>
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center gap-2.5 rounded-md bg-black py-4 px-10 text-center font-medium text-white hover:bg-opacity-60 disabled:opacity-50 lg:px-8 xl:px-10"
          >
            <span>Next</span>
            <ForwardIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AllCourses;
