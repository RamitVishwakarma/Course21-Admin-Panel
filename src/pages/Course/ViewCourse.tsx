import React from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PencilIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import CreateModule from '../Modules/CreateModule';
import UpdateModule from '../Modules/UpdateModule';

const ViewCourse: React.FC = () => {
  const id = useParams().id;

  interface Lectures {
    id: number;
    course_id: number;
    module_id: number;
    prefix: string;
    name: string;
    file_id: number;
    is_trial: boolean;
    created_at: Date;
    updated_at: Date;
  }

  interface Modules {
    id: number;
    name: string;
    sequence_id: number;
    course_id: number;
    lectures: Lectures[];
    image_path: string;
  }

  interface Course {
    id: number;
    prefix: string | null;
    name: string;
    validity: number | null;
    manager: string | null;
    price: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    modules: Modules[];
  }

  const [course, setCourse] = useState<Course>();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}courses/${id}`)
      .then((res) => {
        console.log(res.data);
        setCourse(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

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
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-2xl font-semibold text-black dark:text-white">
            {course?.name}
          </h4>
          <div className="text-sm">Price: ₹{course?.price}</div>
          <div className="text-sm">
            Validity:{course?.validity ? 'course.validity' : ' Lifetime'}
          </div>
          <div className="">
            Last updated at:{' '}
            {course?.updated_at
              ? new Date(course.updated_at).toLocaleString('en-IN', dateOptions)
              : null}
          </div>
        </div>

        <div className="border-y font-semibold border-stroke py-4.5 px-4  text-black dark:text-white dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className=" flex items-center justify-between">
            <p className="font-medium text-2xl">Modules</p>
            <CreateModule courseId={Number(id)} />
          </div>
        </div>

        {course?.modules.map((modules, key) => (
          <Accordion
            className="py-2 px-4 md:px-6 2xl:px-7.5"
            key={key}
            type="single"
            collapsible
          >
            <AccordionItem value={`item-${key}`}>
              <AccordionTrigger>
                <span className="flex items-center gap-3">
                  {modules.name}
                  <div className="flex items-center space-x-3.5">
                    {/* Update Module */}
                    <UpdateModule
                      courseId={Number(id)}
                      name={modules.name}
                      image_path={modules.image_path}
                    />
                  </div>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
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
                    {modules.lectures.map((lecture, key) => (
                      <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white ">
                            {lecture.name}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white text-start">
                            {new Date(lecture.created_at).toLocaleString(
                              'en-IN',
                              dateOptions,
                            )}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white text-start">
                            {new Date(lecture.updated_at).toLocaleString(
                              'en-IN',
                              dateOptions,
                            )}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark ">
                          <p
                            className={`inline-flex rounded-full bg-opacity-10 py-1  text-sm font-medium text-start `}
                          >
                            {lecture.is_trial ? 'Trial' : 'Paid'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="flex items-center space-x-3.5">
                            {/* Update */}
                            <Link
                              to={`/admin/update-course/${course.id}`}
                              className="hover:text-primary "
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default ViewCourse;
