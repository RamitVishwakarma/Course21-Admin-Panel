import React from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../../layout/DefaultLayout';
import axios from 'axios';
import { useState, useEffect } from 'react';

import CreateModule from '../../Modules/CreateModule';
import { Course } from '../../../interfaces/Course';
import Loader from '../../../common/Loader';

import CourseContainer from './CourseContainer';
import ViewModules from './ViewModules';

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

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-4">
        {/* Course Description */}
        {course && <CourseContainer course={course} />}
        {/* Module Creation */}
        <div className="border-y font-semibold border-stroke py-4.5 px-4  text-black dark:text-white dark:border-stroke/20 md:px-6 2xl:px-7.5">
          <div className="flex text-xl items-center justify-between">
            <p className="font-medium text-3xl">Modules</p>
            <CreateModule courseId={Number(id)} refreshPage={refreshPage} />
          </div>
        </div>

        {course?.modules.map((modules, key) => (
          <ViewModules
            modules={modules}
            key={key}
            refreshPage={refreshPage}
            courseId={Number(id)}
          />
        ))}
      </div>
    </DefaultLayout>
  );
};

export default ViewCourse;
