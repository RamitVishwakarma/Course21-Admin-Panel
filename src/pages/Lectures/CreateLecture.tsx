import React from 'react';
import { IdentificationIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { useToast } from '@/components/ui/use-toast';

export default function CreateLecture({
  moduleId,
  refreshPage,
}: {
  moduleId: number;
  refreshPage: () => void;
}) {
  interface FormData {
    name: string;
    featured_image: File | string;
    module_id: number;
  }

  const [data, setData] = useState<FormData>({
    name: '',
    featured_image: new File([], ''),
    module_id: moduleId,
  });

  const { toast } = useToast();

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
      .post(`${import.meta.env.VITE_BACKEND_URL}lectures`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res);
        toast({
          title: 'Lecture Added Successfully',
        });
        refreshPage();
        // alert('Lectures Added Successfully');
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Lecture Addition Failed',
        });
        // alert('Lectures Addition Failed');
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" inline-flex items-center justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-6 text-center font-medium text-white hover:bg-opacity-80 lg:px-4 xl:px-6">
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add Lecture</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Lecture</DialogTitle>
        <form onSubmit={formSubmitHandler}>
          {/* Lectures Name */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleFormData}
                placeholder="Enter Lectures Name"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <span className="absolute right-4 top-4">
                <IdentificationIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>

          {/* Photo upload */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Image
            </label>
            <input
              type="file"
              name="featured_image"
              onChange={handleFormData}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>

          <DialogFooter>
            <div className="mb-5">
              <input
                type="submit"
                value="Submit"
                className="w-full font-medium cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
