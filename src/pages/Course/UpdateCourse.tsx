import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { IdentificationIcon } from '@heroicons/react/20/solid';

const UpdateCourse: React.FC = () => {
  //getting the id of the course from the url
  const id = useParams().id;
  //creating a Course interface
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
  }
  const [course, setCourse] = useState<Course>();

  interface FormData {
    name: string;
  }

  const [data, setData] = useState<FormData>({
    name: '',
  });
  //fetching the course data from the backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}courses/${id}`)
      .then((res) => {
        console.log(res.data);
        setCourse(res.data.data);
        setData({ name: res.data.data.name });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}courses/update/${id}?name=${
          data.name
        }`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then((res) => {
        console.log(res);
        alert('Course Updated Successfully');
      })
      .catch((err) => {
        console.log(err);
        alert('Update Failed');
      });
  };

  return (
    <DefaultLayout>
      <form onSubmit={formSubmitHandler}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Course Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleFormData}
              placeholder="Enter Email or Username"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />

            <span className="absolute right-4 top-4">
              <IdentificationIcon className="w-6 h-6 text-bodydark" />
            </span>
          </div>
        </div>

        <div className="mb-5">
          <input
            type="submit"
            value="Submit"
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
          />
        </div>
      </form>
    </DefaultLayout>
  );
};

export default UpdateCourse;
