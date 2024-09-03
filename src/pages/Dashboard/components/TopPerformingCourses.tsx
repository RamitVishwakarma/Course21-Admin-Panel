const TopPerformingCourses = ({ courses }: any) => {
  console.log(courses);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };
  return (
    <>
      <table className="w-full table-auto ">
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
          {courses.map((course: any) => (
            <tr key={course.id}>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <div className="flex gap-4 items-center">
                  {course.image_path ? (
                    <img
                      className="h-12.5 w-15 rounded-md"
                      src={`${import.meta.env.VITE_BACKEND_STORAGE_URL}${
                        course.image_path
                      }`}
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
                  {course.total_sales}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="flex items-center space-x-3.5">
                  ₹{course.total_revenue}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TopPerformingCourses;
