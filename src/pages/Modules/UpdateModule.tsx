import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { IdentificationIcon, PencilIcon } from '@heroicons/react/20/solid';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export default function UpdateModule({
  courseId,
  moduleId,
  name,
  image_path,
  refreshPage,
}: {
  courseId: number;
  moduleId: number;
  name: string;
  image_path: string;
  refreshPage: () => void;
}) {
  const { toast } = useToast();
  interface FormData {
    name: string;
    featured_image: File | string;
    course_id: number;
  }

  const [data, setData] = useState<FormData>({
    name: name ? name : '',
    featured_image: image_path ? image_path : new File([''], ''),
    course_id: courseId,
  });

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
      .post(
        `${import.meta.env.VITE_BACKEND_URL}modules/update/${moduleId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then((res) => {
        console.log(res);
        toast({
          title: 'Module Updated Successfully',
        });
        refreshPage();
        // alert('Module Updated Successfully');
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Module Update Failed',
          variant: 'destructive',
        });
        // alert('Module Update Failed');
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex text-lg items-center justify-center gap-2.5 rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-6">
          <PencilIcon className="h-4 w-4" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Module</DialogTitle>
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
              name="featured_image"
              onChange={handleFormData}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>
          {/* Submit Button */}
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
