import { type CourseAnalytics } from '@/types';

interface TopPerformingCoursesProps {
  courses: CourseAnalytics[];
}

const TopPerformingCourses = ({ courses }: TopPerformingCoursesProps) => {
  console.log('Top Performing Courses Data:', courses);

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {courses && courses.length > 0 ? (
          courses.map((course: CourseAnalytics) => (
            <div
              key={course.courseId}
              className="rounded-lg border border-gray-200 dark:border-strokedark bg-white dark:bg-meta-4 p-4 shadow-sm min-w-0"
            >
              <div className="font-semibold text-lg text-black dark:text-white mb-1">
                {course.courseName}
              </div>
              <div className="text-sm mb-2 text-gray-600 dark:text-gray-300">
                Completion: {course.completionRate}%
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <div>
                  <span className="font-medium">Created:</span> Dec 15, 2024
                </div>
                <div>
                  <span className="font-medium">Updated:</span> Dec 31, 2024
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                <div>
                  <span className="font-medium">Sales:</span>{' '}
                  {course.totalEnrollments.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Revenue:</span> ₹
                  {course.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No course data available
          </div>
        )}
      </div>
      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto min-w-[600px]">
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
                Total Sales
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody className="[&>*:nth-child(even)]:bg-gray-2 dark:[&>*:nth-child(even)]:bg-meta-4 ">
            {courses && courses.length > 0 ? (
              courses.map((course: CourseAnalytics) => (
                <tr key={course.courseId}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <div className="flex gap-4 items-center">
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {course.courseName}
                        </h5>
                        <p className="text-sm">
                          Completion: {course.completionRate}%
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white text-start">
                      Dec 15, 2024
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white text-start">
                      Dec 31, 2024
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                      {course.totalEnrollments.toLocaleString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      ₹{course.totalRevenue.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No course data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TopPerformingCourses;
