import UpdateLecture from '../../Lectures/UpdateLecture';
import DeleteLecture from '../../Lectures/DeleteLecture';
import { Lectures } from '@/interfaces/Lectures';
import { Bars4Icon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const ViewLectures = ({
  lecture,
  index,
  refreshPage,
  moduleId,
  courseId,
}: {
  lecture: Lectures;
  index: number;
  refreshPage: () => void;
  moduleId: number;
  courseId: number;
}) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };

  const [mouseHover, setMouseHover] = useState(false);
  return (
    <tr
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      className="bg-boxdark"
      key={index}
    >
      <td className=" border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
        <div className="flex gap-4 items-center ">
          {mouseHover && <Bars4Icon className="h-6 w-6 cursor-grab -ml-8" />}
          {lecture.image_path ? (
            <img
              className="h-12.5 w-15 rounded-md"
              src={`${import.meta.env.VITE_BACKEND_STORAGE_URL}${
                lecture.image_path
              }`}
            />
          ) : null}
          <div>
            <h5 className="font-medium text-black dark:text-white ">
              {lecture.name}
            </h5>
          </div>
        </div>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white text-start">
          {new Date(lecture.created_at).toLocaleString('en-IN', dateOptions)}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        <p className="text-black dark:text-white text-start">
          {new Date(lecture.updated_at).toLocaleString('en-IN', dateOptions)}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark ">
        <p
          className={`inline-flex rounded-full bg-opacity-10 py-1 px-2 text-sm font-medium text-start `}
        >
          {lecture.is_trial ? 'Trial' : 'Paid'}
        </p>
      </td>
      <td className="border-b border-[#eee] py-5 px-6 dark:border-strokedark">
        <div className="flex items-center space-x-3.5">
          <UpdateLecture
            lectureId={lecture.id}
            moduleId={moduleId}
            courseId={courseId}
            name={lecture.name}
            image_path={lecture.image_path}
            refreshPage={refreshPage}
          />
          <DeleteLecture lectureId={lecture.id} refresh={refreshPage} />
        </div>
      </td>
    </tr>
  );
};

export default ViewLectures;
