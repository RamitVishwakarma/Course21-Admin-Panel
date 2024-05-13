import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars4Icon, EyeIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpdateLecture from '../Lectures/UpdateLecture';
import DeletLecture from '../Lectures/DeleteLecture';
import { Lectures } from '@/interfaces/Lectures';

const LectureView = ({
  lecture,
  index,
  moduleId,
  courseId,
  refreshPage,
}: {
  lecture: Lectures;
  index: number;
  refreshPage: () => void;
  courseId: number | undefined;
  moduleId: number;
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: module.id,
    data: {
      type: 'module',
      module,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [mouseHover, setMouseHover] = useState(false);

  const navigate = useNavigate();

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`opacity-40 py-2 px-4 md:px-6 2xl:px-7.5 ring-2 ring-bodydark dark:ring-white rounded-md bg-gray-2 dark:bg-meta-4 `}
        key={index}
      >
        <div {...attributes} {...listeners}>
          <div className="flex gap-4 items-center p-4 ">
            <div className="w-30 h-30 rounded-lg object-cover"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`py-2 px-4 md:px-6 2xl:px-7.5 rounded-md hover:ring-2 hover:dark:ring-white hover:ring-bodydark bg-gray-2 dark:bg-meta-4 `}
      key={index}
    >
      <div {...attributes} {...listeners}>
        <div
          onMouseEnter={() => setMouseHover(true)}
          onMouseLeave={() => setMouseHover(false)}
          className="flex gap-4 items-center p-4 "
        >
          {mouseHover && <Bars4Icon className="h-9 w-9  cursor-grab" />}
          {lecture.image_path ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_STORAGE_URL}${
                lecture.image_path
              }`}
              className="w-30 h-30 rounded-lg object-cover "
            />
          ) : (
            <div>
              <div className="w-30 h-30 bg-gray dark:bg-boxdark text-black dark:text-white p-2 rounded-lg text-center">
                No Image
              </div>
            </div>
          )}
          <div className="pl-2 w-full text-xl">
            <div className="flex justify-between gap-3 text-2xl ">
              <div className=" flex flex-col">
                <div className="font-medium text-2xl -px ">{lecture.name}</div>
              </div>
              {mouseHover && (
                <div className="flex items-center space-x-3.5 -mt-20">
                  {/* View */}
                  <button
                    onClick={() => {
                      navigate(
                        `/admin/view-course/${courseId}/view-module/${module.id}`,
                      );
                    }}
                    className="inline-flex text-lg items-center justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-6"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </button>
                  {/* Update Module */}
                  <UpdateLecture
                    lectureId={lecture.id}
                    courseId={courseId}
                    moduleId={module.id}
                    name={module.name}
                    image_path={module.image_path}
                    refreshPage={refreshPage}
                  />
                  <DeletLecture moduleId={module.id} refresh={refreshPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureView;
