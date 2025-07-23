import { type Lecture } from '../../types';
import UpdateLecture from '../Lectures/UpdateLecture';
import DeleteLecture from '../Lectures/DeleteLecture';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Bars4Icon,
  PlayCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';

interface LectureCardProps {
  lecture: Lecture;
  index: number;
  refreshPage: () => void;
  moduleId: string;
}

export default function LectureCard({
  lecture,
  index,
  refreshPage,
  moduleId,
}: LectureCardProps) {
  const [mouseHover, setMouseHover] = useState(false);

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`opacity-40 py-2 px-4 md:px-6 2xl:px-7.5 ring-2 ring-bodydark dark:ring-white rounded-md bg-gray-2 dark:bg-meta-4 `}
      ></div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div className="p-4">
        <div
          onMouseEnter={() => setMouseHover(true)}
          onMouseLeave={() => setMouseHover(false)}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-medium">
                {index + 1}
              </span>
              <PlayCircleIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {lecture.title}
                </h3>
                {lecture.isPublished ? (
                  <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                    Published
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                    Draft
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {lecture.description}
              </p>

              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {formatDuration(lecture.videoDuration)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {lecture.type}
                </span>
                {lecture.isFree && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    Free Preview
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mouseHover && (
              <div className="flex gap-2">
                <UpdateLecture
                  moduleId={moduleId}
                  lectureId={lecture.id}
                  courseId={lecture.courseId}
                  name={lecture.title}
                  refreshPage={refreshPage}
                />
                <DeleteLecture lectureId={lecture.id} refresh={refreshPage} />
              </div>
            )}

            <div
              {...attributes}
              {...listeners}
              className="p-2 cursor-grab text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Drag to reorder"
            >
              <Bars4Icon className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Video Preview (if available) */}
        {lecture.videoUrl && (
          <div className="mt-3 pt-3 border-t border-stroke dark:border-strokedark">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <div className="text-center">
                <PlayCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to preview video
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
