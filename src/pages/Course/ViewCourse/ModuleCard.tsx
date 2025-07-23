import { type Module } from '../../../types';
import UpdateModule from '../../Modules/UpdateModule';
import DeletModule from '../../Modules/DeleteModule';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars4Icon, EyeIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface ModuleCardProps {
  module: Module;
  index: number;
  refreshPage: () => void;
  courseId: string;
}
export default function ModuleCard({
  module,
  index,
  refreshPage,
  courseId,
}: ModuleCardProps) {
  const [mouseHover, setMouseHover] = useState(false);
  const navigate = useNavigate();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id, data: { type: 'module', module } });
  const style = { transition, transform: CSS.Transform.toString(transform) };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`opacity-40 py-2 px-4 md:px-6 2xl:px-7.5 ring-2 ring-bodydark dark:ring-white rounded-md bg-gray-2 dark:bg-meta-4 `}
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      {' '}
      <div className="p-6">
        {' '}
        <div
          onMouseEnter={() => setMouseHover(true)}
          onMouseLeave={() => setMouseHover(false)}
          className="flex items-start justify-between gap-4"
        >
          {' '}
          <div className="flex-1">
            {' '}
            <div className="flex items-center gap-2 mb-2">
              {' '}
              <h3 className="text-xl font-semibold text-black dark:text-white">
                {' '}
                {module.title}{' '}
              </h3>{' '}
              {module.isPublished ? (
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                  {' '}
                  Published{' '}
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                  {' '}
                  Draft{' '}
                </span>
              )}{' '}
            </div>{' '}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {' '}
              {module.description}{' '}
            </p>{' '}
            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
              {' '}
              <span className="flex items-center gap-1">
                {' '}
                <span className="font-medium">{module.lectureCount}</span>{' '}
                lectures{' '}
              </span>{' '}
              <span className="flex items-center gap-1">
                {' '}
                <span className="font-medium">
                  {Math.floor(module.duration / 60)}h {module.duration % 60}m
                </span>{' '}
                duration{' '}
              </span>{' '}
              <span className="flex items-center gap-1">
                {' '}
                <span className="font-medium">
                  {module.enrollmentCount}
                </span>{' '}
                enrolled{' '}
              </span>{' '}
            </div>{' '}
          </div>{' '}
          <div className="flex items-center gap-2">
            {' '}
            {mouseHover && (
              <div className="flex gap-2">
                {' '}
                <UpdateModule
                  courseId={courseId}
                  moduleId={module.id}
                  title={module.title}
                  description={module.description}
                  refresh={refreshPage}
                />{' '}
                <DeletModule moduleId={module.id} refresh={refreshPage} />{' '}
              </div>
            )}{' '}
            <button
              onClick={() =>
                navigate(
                  `/admin/view-course/${courseId}/view-module/${module.id}`,
                )
              }
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="View Module"
            >
              {' '}
              <EyeIcon className="w-5 h-5" />{' '}
            </button>{' '}
            <div
              {...attributes}
              {...listeners}
              className="p-2 cursor-grab text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Drag to reorder"
            >
              {' '}
              <Bars4Icon className="w-5 h-5" />{' '}
            </div>{' '}
          </div>{' '}
        </div>
      </div>
    </div>
  );
}
