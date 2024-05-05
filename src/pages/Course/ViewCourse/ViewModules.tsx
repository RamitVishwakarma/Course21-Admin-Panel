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

const ViewModules = ({
  modules,
  key,
  refreshPage,
  courseId,
}: {
  modules: Modules;
  key: number;
  refreshPage: () => void;
  courseId: number;
}) => {
  return (
    <Accordion
      className={`py-2 px-4 md:px-6 2xl:px-7.5 ${
        key % 2 == 0 ? 'bg-gray-2 dark:bg-meta-4' : ''
      } `}
      key={key}
      type="single"
      collapsible
    >
      <AccordionItem value={`item-${key}`}>
        <div className="flex gap-4 items-center p-4 ">
          {modules.image_path ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_STORAGE_URL}${
                modules.image_path
              }`}
              className="w-30 h-30 rounded-lg object-cover"
            />
          ) : (
            <div>
              <div className="w-30 h-30 bg-gray dark:bg-black text-black dark:text-white p-2 rounded-lg">
                No image added update image in module edit
              </div>
            </div>
          )}
          <div className="pl-2 w-full text-xl">
            <div className="flex justify-between gap-3 text-2xl ">
              <div className=" flex flex-col">
                <div className="font-medium text-2xl -px">{modules.name}</div>
                <div className="text-sm w-24">
                  <AccordionTrigger>Show More</AccordionTrigger>
                </div>
              </div>
              <div className="flex items-center space-x-3.5 -mt-20">
                {/* Update Module */}
                <UpdateModule
                  courseId={courseId}
                  moduleId={modules.id}
                  name={modules.name}
                  image_path={modules.image_path}
                  refreshPage={refreshPage}
                />
                <DeletModule moduleId={modules.id} refresh={refreshPage} />
              </div>
            </div>
          </div>
        </div>

        <AccordionContent>
          <div className="p-2 text-lg text-end">
            <CreateLecture moduleId={modules.id} refreshPage={refreshPage} />
          </div>
          <table className="w-full table-auto ">
            <thead>
              <tr
                className={`${
                  key % 2 == 0
                    ? 'bg-gray-2 dark:bg-boxdark'
                    : 'bg-success dark:bg-meta-4'
                } text-left text-2xl  `}
              >
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
            <tbody
              className={`[&>*:nth-child(even)]:bg-gray-2 dark:[&>*:nth-child(even)]:bg-boxdark ${
                key % 2 == 0 ? '' : 'dark:[&>*:nth-child(even)]:bg-meta-4 '
              }`}
            >
              {modules.lectures.map((lecture, key) => (
                <ViewLectures
                  lecture={lecture}
                  key={key}
                  refreshPage={refreshPage}
                  moduleId={modules.id}
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
