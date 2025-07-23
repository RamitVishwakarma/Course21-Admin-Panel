import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/20/solid';
import { type Course } from '@/types/Course';
import DefaultLayout from '../../layout/DefaultLayout';
import DeleteCourse from './DeleteCourse';
import CreateCourse from './CreateCourse';
import UpdateCourse from './UpdateCourse';
import Loader from '../../components/ui/loader';
import { useCourseStore } from '@/store/useCourseStore';

const ITEMS_PER_PAGE = 10; // Number of courses per page

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const allCourses = useCourseStore((state) => state.courses);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);

  const getPaginatedCourses = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allCourses.slice(startIndex, endIndex);
  }, [allCourses, currentPage]);

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
    // Always fetch courses to ensure data is loaded
    const loadData = async () => {
      setLoading(true);
      await fetchCourses();

      // After fetching, calculate pagination
      const total = Math.ceil(allCourses.length / ITEMS_PER_PAGE);
      setTotalPages(total);

      // Set paginated courses
      const paginatedCourses = getPaginatedCourses();
      setCourses(paginatedCourses);
      setLoading(false);
    };

    loadData();
  }, [fetchCourses, getPaginatedCourses]);

  // Update displayed courses when data changes or page changes
  useEffect(() => {
    if (allCourses.length > 0 && !loading) {
      const total = Math.ceil(allCourses.length / ITEMS_PER_PAGE);
      setTotalPages(total);
      setCourses(getPaginatedCourses());
    }
  }, [currentPage, allCourses, getPaginatedCourses, loading]);

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
                <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Course Details
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Created Date
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Last Modified
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Difficulty Level
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
                      {course.thumbnail ? (
                        <img
                          className="h-15 w-20 rounded-lg object-cover shadow-sm"
                          src={course.thumbnail}
                          alt={course.title}
                        />
                      ) : (
                        <div className="h-15 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h5 className="font-semibold text-lg text-black dark:text-white mb-1">
                          {course.title}
                        </h5>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ₹{course.price?.toLocaleString() || '0'}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {course.description?.slice(0, 80)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="text-black dark:text-white">
                      <p className="font-medium">
                        {new Date(course.createdAt).toLocaleDateString(
                          'en-IN',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(course.createdAt).toLocaleTimeString(
                          'en-IN',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          },
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="text-black dark:text-white">
                      <p className="font-medium">
                        {new Date(course.updatedAt).toLocaleDateString(
                          'en-IN',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(course.updatedAt).toLocaleTimeString(
                          'en-IN',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          },
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          course.level === 'beginner'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : course.level === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : course.level === 'advanced'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {course.level
                          ? course.level.charAt(0).toUpperCase() +
                            course.level.slice(1)
                          : 'Not Set'}
                      </span>
                    </div>
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
                      <DeleteCourse courseId={parseInt(course.id)} />
                      {/* Update button */}
                      <UpdateCourse
                        courseId={parseInt(course.id)}
                        name={course.title}
                        image_path={course.thumbnail || ''}
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
