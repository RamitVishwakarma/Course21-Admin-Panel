import React, { useState } from 'react';
import axios from 'axios';
import { IdentificationIcon, PencilIcon } from '@heroicons/react/20/solid';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export default function UpdateLecture({
  lectureId,
  courseId,
  moduleId,
  name,
  refreshPage,
}: {
  lectureId: number;
  courseId: number;
  moduleId: number;
  name: string;
  refreshPage: () => void;
}) {
  const { toast } = useToast();

  interface FormData {
    name: string;
    featured_image: File | string;
    course_id: number;
    module_id: number;
    video_file: File | string;
  }

  const [data, setData] = useState<FormData>({
    name: name ? name : '',
    featured_image: new File([''], ''),
    course_id: courseId,
    module_id: moduleId,
    video_file: new File([], ''),
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [open, setOpen] = useState(false);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file') {
      const name = e.target.name;
      const file = e.target.files![0];
      setData({ ...data, [name]: file });
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('course_id', data.course_id.toString());
    formData.append('module_id', data.module_id.toString());
    formData.append(
      'featured_image',
      data.featured_image ? data.featured_image : '',
    );
    if (data.video_file) {
      formData.append('video_file', data.video_file);
    }
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}lectures/update/${lectureId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (ProgressEvent) => {
            const percentCompleted = ProgressEvent.total
              ? Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
              : 0;
            setUploadProgress(percentCompleted);
          },
        },
      )
      .then((res) => {
        console.log(res);
        toast({
          title: 'Lecture Updated Successfully',
        });
        refreshPage();
      })
      .catch(() => {
        toast({
          title: 'Lecture Update Failed',
          variant: 'destructive',
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex text-lg items-center justify-center gap-2.5 rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-6">
          <PencilIcon className="h-4 w-4" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Lecture</DialogTitle>
        <form onSubmit={formSubmitHandler}>
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
                placeholder="Enter Lecture Name "
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <span className="absolute right-4 top-4">
                <IdentificationIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>
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
          {/* video uploader */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Video
            </label>
            <input
              type="file"
              name="video_file"
              accept="video/*"
              onChange={handleFormData}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>
          {data.video_file && data.video_file instanceof File && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{data.video_file.name}</span>
                <span className="text-gray-600">
                  {uploadProgress.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {/* video uploader end */}
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
