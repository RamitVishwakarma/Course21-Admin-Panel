import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { IdentificationIcon } from '@heroicons/react/20/solid';

const UpdateModule: React.FC = () => {
  //getting the id of the Modules from the url
  const id = useParams().id;

  interface FormData {
    name: string;
    image: File;
  }

  const [data, setData] = useState<FormData>({
    name: '',
    image: new File([''], ''),
  });
  //fetching the Modules data from the backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}modules/${id}`)
      .then((res) => {
        console.log(res.data.module.name);
        setData({ ...data, name: res.data.module.name });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file') {
      setData({ ...data, [e.target.name]: e.target.files![0] });
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}modules/update/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res);
        alert('Module Updated Successfully');
      })
      .catch((err) => {
        console.log(err);
        alert('Module Update Failed');
      });
  };

  return (
    <DefaultLayout>
      <form onSubmit={formSubmitHandler}>
        {/* Name */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Module Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleFormData}
              placeholder="Enter Module Name "
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <span className="absolute right-4 top-4">
              <IdentificationIcon className="w-6 h-6 text-bodydark" />
            </span>
          </div>
        </div>
        {/* Image upload */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Cover Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFormData}
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />
        </div>
        {/* Submit Button */}
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

export default UpdateModule;
