import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  CurrencyRupeeIcon,
  IdentificationIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import axios from 'axios';

const Dashboard: React.FC = () => {
  interface FormData {
    name: string;
    price: number;
  }

  const [data, setData] = useState<FormData>({
    name: '',
    price: 0,
  });

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}courses`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res);
        alert('Course Added Successfully');
      })
      .catch((err) => {
        console.log(err);
        alert('Login Failed');
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
              onChange={handleFormData}
              placeholder="Enter Email or Username"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />

            <span className="absolute right-4 top-4">
              <IdentificationIcon className="w-6 h-6 text-bodydark" />
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Price
          </label>
          <div className="relative">
            <input
              type="text"
              name="price"
              onChange={handleFormData}
              placeholder="Enter Email or Username"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />

            <span className="absolute right-4 top-4">
              <CurrencyRupeeIcon className="w-6 h-6 text-bodydark" />
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

export default Dashboard;
