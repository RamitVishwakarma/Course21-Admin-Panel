import React, { useState } from 'react';
import { IdentificationIcon, PencilIcon } from '@heroicons/react/20/solid';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useLectureStore } from '@/store/useLectureStore';

export default function UpdateLecture({
  lectureId,
  courseId,
  moduleId,
  name,
  refreshPage,
}: {
  lectureId: string;
  courseId: string;
  moduleId: string;
  name: string;
  refreshPage: () => void;
}) {
  interface FormData {
    title: string;
    description: string;
    videoDuration: number;
    type: 'video' | 'text' | 'quiz' | 'assignment';
    videoUrl: string;
    content?: string;
    isFree: boolean;
  }

  const { toast } = useToast();

  const updateLecture = useLectureStore((state) => state.updateLecture);
  const lectures = useLectureStore((state) => state.lectures);
  const fetchLectureById = (id: string) =>
    lectures.find((lecture) => lecture.id === id);

  const lectureData = fetchLectureById(lectureId);

  const [data, setData] = useState<FormData>({
    title: lectureData?.title || '',
    description: lectureData?.description || '',
    videoDuration: lectureData?.videoDuration || 0,
    type: lectureData?.type || 'video',
    videoUrl: lectureData?.videoUrl || '',
    content: lectureData?.content || '',
    isFree: lectureData?.isFree || false,
  });

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleFormData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (type === 'number') {
      setData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev: number) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    simulateUpload();

    setTimeout(() => {
      try {
        const updates = {
          title: data.title,
          description: data.description,
          videoDuration: data.videoDuration,
          type: data.type,
          videoUrl: data.videoUrl,
          content: data.content,
          isFree: data.isFree,
        };

        updateLecture(lectureId, updates);

        toast({
          title: 'Lecture Updated Successfully',
        });

        refreshPage();
        setOpen(false);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Lecture Update Failed',
          variant: 'destructive',
        });
      }
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-3 text-center font-medium text-primary hover:bg-opacity-90 lg:px-4 xl:px-6">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Lecture</DialogTitle>
        <form onSubmit={formSubmitHandler}>
          {/* Lecture Title */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleFormData}
                placeholder="Enter Lecture Title"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <span className="absolute right-4 top-4">
                <IdentificationIcon className="h-6 w-6 opacity-50" />
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleFormData}
              placeholder="Enter description"
              rows={3}
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Video Duration */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Video Duration (seconds)
            </label>
            <input
              type="number"
              name="videoDuration"
              value={data.videoDuration}
              onChange={handleFormData}
              placeholder="Duration in seconds"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Type
            </label>
            <select
              name="type"
              value={data.type}
              onChange={handleFormData}
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          {/* Video URL */}
          {data.type === 'video' && (
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Video URL
              </label>
              <input
                type="url"
                name="videoUrl"
                value={data.videoUrl}
                onChange={handleFormData}
                placeholder="Enter video URL"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          )}

          {/* Content */}
          {data.type === 'text' && (
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Content
              </label>
              <textarea
                name="content"
                value={data.content}
                onChange={handleFormData}
                placeholder="Enter lecture content"
                rows={5}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          )}

          {/* Free Preview */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isFree"
                checked={data.isFree}
                onChange={handleFormData}
                className="mr-2"
              />
              <span className="font-medium text-black dark:text-white">
                Available as free preview
              </span>
            </label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-white">
                  Uploading...
                </span>
                <span className="text-sm font-medium text-blue-700 dark:text-white">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex w-full justify-center rounded-md bg-primary py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Updating...' : 'Update Lecture'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
