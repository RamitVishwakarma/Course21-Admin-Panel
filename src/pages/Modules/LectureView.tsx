import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars4Icon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import UpdateLecture from '../Lectures/UpdateLecture';
import DeleteLecture from '../Lectures/DeleteLecture';
import { Lectures } from '@/interfaces/Lectures';
import ViewLecture from '../Lectures/ViewLecture';

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
    id: lecture.id,
    data: {
      type: 'lecture',
      lecture,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [mouseHover, setMouseHover] = useState(false);

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
      <div>
        <div
          onMouseEnter={() => setMouseHover(true)}
          onMouseLeave={() => setMouseHover(false)}
          className="flex gap-4 items-center p-4 "
        >
          {mouseHover && (
            <div {...attributes} {...listeners}>
              <Bars4Icon className="h-9 w-9  cursor-grab" />
            </div>
          )}
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
                <div className="font-medium text-2xl ">{lecture.name}</div>
                <div className="flex items-center py-3 gap-4">
                  <div className="text-xl ">Status:</div>
                  <div className="flex items-center">
                    {lecture.transcodingjob?.status === 'completed' ? (
                      <span className=" text-xs border-2 rounded-full border-meta-3/70 px-2.5 py-1 font-medium">
                        Ready
                      </span>
                    ) : (
                      <span className=" text-xs border-2 rounded-full border-meta-1/70 px-2 py-0.5 font-medium">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {mouseHover && (
                <div className="flex items-center max-md:gap-2 md:space-x-3.5 md:-mt-20 max-md:flex-col">
                  <ViewLecture Lecture={lecture} VideoId={lecture.video_id} />
                  {/* Update Lecture */}
                  <UpdateLecture
                    lectureId={lecture.id}
                    courseId={Number(courseId)}
                    moduleId={moduleId}
                    name={lecture.name}
                    refreshPage={refreshPage}
                  />
                  <DeleteLecture lectureId={lecture.id} refresh={refreshPage} />
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
