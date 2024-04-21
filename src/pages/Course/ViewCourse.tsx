import React from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { useState, useEffect } from 'react';

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

  type Product = {
    name: string;
    category: string;
    price: number;
    sold: number;
    profit: number;
  };
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
  // Add your component logic here

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

        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Modules</p>
          </div>
        </div>

        {course?.modules.map((modules, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">
                  {modules.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default ViewCourse;
