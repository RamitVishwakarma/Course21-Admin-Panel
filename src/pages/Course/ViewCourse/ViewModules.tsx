import { Modules } from '@/interfaces/Modules';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import UpdateModule from '../../Modules/UpdateModule';
import DeletModule from '../../Modules/DeleteModule';
import CreateLecture from '../../Lectures/CreateLecture';
import ViewLectures from './ViewLectures';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars4Icon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const ViewModules = ({
  module,
  index,
  refreshPage,
  courseId,
}: {
  module: Modules;
  index: number;
  refreshPage: () => void;
  courseId: number;
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

  if (isDragging) {
    return (
      <Accordion
        ref={setNodeRef}
        style={style}
        className={`opacity-40 py-2 px-4 md:px-6 2xl:px-7.5 ring-2 ring-bodydark dark:ring-white rounded-md bg-gray-2 dark:bg-meta-4 `}
        key={index}
        type="single"
        collapsible
      >
        <AccordionItem {...attributes} {...listeners} value={`item-${index}`}>
          <div className="flex gap-4 items-center p-4 ">
            <div className="w-30 h-30 rounded-lg object-cover"></div>
          </div>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <Accordion
      ref={setNodeRef}
      style={style}
      className={`py-2 px-4 md:px-6 2xl:px-7.5 rounded-md hover:ring-2 hover:dark:ring-white hover:ring-bodydark bg-gray-2 dark:bg-meta-4 `}
      key={index}
      type="single"
      collapsible
    >
      <AccordionItem {...attributes} {...listeners} value={`item-${index}`}>
        <div
          onMouseEnter={() => setMouseHover(true)}
          onMouseLeave={() => setMouseHover(false)}
          className="flex gap-4 items-center p-4 "
        >
          {mouseHover && <Bars4Icon className="h-9 w-9  cursor-grab" />}
          {module.image_path ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_STORAGE_URL}${
                module.image_path
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
                <div className="font-medium text-2xl -px ">{module.name}</div>
                <div className="text-sm w-24">
                  <AccordionTrigger>Show More</AccordionTrigger>
                </div>
              </div>
              {mouseHover && (
                <div className="flex items-center space-x-3.5 -mt-20">
                  {/* Update Module */}
                  <UpdateModule
                    courseId={courseId}
                    moduleId={module.id}
                    name={module.name}
                    image_path={module.image_path}
                    refreshPage={refreshPage}
                  />
                  <DeletModule moduleId={module.id} refresh={refreshPage} />
                </div>
              )}
            </div>
          </div>
        </div>

        <AccordionContent>
          <div className="p-2 text-lg text-end">
            <CreateLecture moduleId={module.id} refreshPage={refreshPage} />
          </div>
          <table className="w-full table-auto bg-white dark:bg-black">
            <thead className="border-b border-meta-4">
              <tr className="text-left text-2xl">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Lectures
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Created At
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Updated At
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Trial
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {module.lectures.map((lecture, index) => (
                <ViewLectures
                  key={index} // this is just for show
                  lecture={lecture}
                  index={index}
                  refreshPage={refreshPage}
                  moduleId={module.id}
                  courseId={courseId}
                />
              ))}
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ViewModules;
