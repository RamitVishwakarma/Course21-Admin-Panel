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
import CreateModule from '../Modules/CreateModule';
import UpdateModule from '../Modules/UpdateModule';
import { Course } from '../../interfaces/Course';
import Loader from '../../common/Loader';
import CreateLecture from '../Lectures/CreateLecture';
import UpdateLecture from '../Lectures/UpdateLecture';
import DeleteLecture from '../Lectures/DeleteLecture';
import DeletModule from '../Modules/DeleteModule';

const ViewCourse: React.FC = () => {
  const id = useParams().id;
  const [course, setCourse] = useState<Course>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}courses/${id}`)
      .then((res) => {
        console.log(res.data);
        setCourse(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, refresh]);

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-4">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <div className="flex gap-4 items-center ">
            <div>
              {course?.image_path ? (
                <img
                  src={course?.image_path}
                  alt="course"
                  className="w-40 h-40 rounded-lg objet-cover"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-2 dark:bg-black text-white text-center flex items-center rounded-md">
                  No image added update image in course edit
                </div>
              )}
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-black dark:text-white">
                {course?.name}
              </h4>
              <div className="text-sm">Price: ₹{course?.price}</div>
              <div className="text-sm">
                Validity:{course?.validity ? 'course.validity' : ' Not Set'}
              </div>
              <div className="">
                Last updated at:{' '}
                {course?.updated_at
                  ? new Date(course.updated_at).toLocaleString(
                      'en-IN',
                      dateOptions,
                    )
                  : null}
              </div>
            </div>
          </div>
        </div>

        <div className="border-y font-semibold border-stroke py-4.5 px-4  text-black dark:text-white dark:border-stroke/20 md:px-6 2xl:px-7.5">
          <div className="flex text-xl items-center justify-between">
            <p className="font-medium text-3xl">Modules</p>
            <CreateModule courseId={Number(id)} refreshPage={refreshPage} />
          </div>
        </div>

        {course?.modules.map((modules, key) => (
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
                      <div className="font-medium text-2xl -px">
                        {modules.name}
                      </div>
                      <div className="text-sm w-24">
                        <AccordionTrigger>Show More</AccordionTrigger>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3.5 -mt-20">
                      {/* Update Module */}
                      <UpdateModule
                        courseId={Number(id)}
                        moduleId={modules.id}
                        name={modules.name}
                        image_path={modules.image_path}
                        refreshPage={refreshPage}
                      />
                      <DeletModule
                        moduleId={modules.id}
                        refresh={refreshPage}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <AccordionContent>
                <div className="p-2 text-lg text-end">
                  <CreateLecture
                    moduleId={modules.id}
                    refreshPage={refreshPage}
                  />
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
                      key % 2 == 0
                        ? ''
                        : 'dark:[&>*:nth-child(even)]:bg-meta-4 '
                    }`}
                  >
                    {modules.lectures.map((lecture, key) => (
                      <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <div className="flex gap-4 items-center ">
                            {lecture.image_path ? (
                              <img
                                className="h-12.5 w-15 rounded-md"
                                src={`${
                                  import.meta.env.VITE_BACKEND_STORAGE_URL
                                }${lecture.image_path}`}
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
                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-2 text-sm font-medium text-start `}
                          >
                            {lecture.is_trial ? 'Trial' : 'Paid'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-6 dark:border-strokedark">
                          <div className="flex items-center space-x-3.5">
                            <UpdateLecture
                              lectureId={lecture.id}
                              moduleId={modules.id}
                              courseId={Number(id)}
                              name={lecture.name}
                              image_path={lecture.image_path}
                              refreshPage={refreshPage}
                            />
                            <DeleteLecture
                              lectureId={lecture.id}
                              refresh={refreshPage}
                            />
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
