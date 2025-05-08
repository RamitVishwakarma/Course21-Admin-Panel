import React, { useState, useEffect } from 'react';
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
  lectureId: number;
  courseId: number;
  moduleId: number;
  name: string;
  refreshPage: () => void;
}) {
  const { toast } = useToast();

  // Get lecture functions from our store
  const updateLecture = useLectureStore((state) => state.updateLecture);
  const fetchLectures = useLectureStore((state) => state.fetchLectures);
  const fetchLectureById = useLectureStore((state) => state.fetchLectureById);

  // Ensure lectures are loaded
  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Get the current lecture data
  const lectureData = fetchLectureById(lectureId);

  interface FormData {
    title: string;
    description: string;
    featured_image: File | string;
    module_id: number;
    video_file: File | string;
  }

  const [data, setData] = useState<FormData>({
    title: name || '',
    description: lectureData?.description || '',
    featured_image: new File([''], ''),
    module_id: moduleId,
    video_file: new File([], ''),
  });

  // Upload progress state for simulation
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const name = e.target.name;
      const file = e.target.files![0];
      setData({ ...data, [name]: file });
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
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

    // Simulate file upload
    simulateUpload();

    // Update the lecture in our store after "upload" is complete
    setTimeout(() => {
      try {
        // Only update the video URL if a new file is selected
        const updates: Partial<any> = {
          title: data.title,
          description: data.description,
        };

        // If video file is selected, simulate a new URL
        if (
          data.video_file &&
          data.video_file instanceof File &&
          data.video_file.name
        ) {
          updates.url = `https://example.com/videos/${Math.random()
            .toString(36)
            .substring(2)}.mp4`;
        }

        // If image file is selected, simulate a new URL
        if (
          data.featured_image &&
          data.featured_image instanceof File &&
          data.featured_image.name
        ) {
          updates.resource_url = `https://example.com/images/${Math.random()
            .toString(36)
            .substring(2)}.jpg`;
        }

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
                required
              />
              <span className="absolute right-4 top-4">
                <IdentificationIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>

          {/* Lecture Description */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleFormData}
              placeholder="Enter Lecture Description"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              rows={3}
            />
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

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Updating lecture...</span>
                <span className="text-gray-600">
                  {uploadProgress.toFixed(0)}%
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
                value={isUploading ? 'Updating...' : 'Submit'}
                disabled={isUploading}
                className="w-full font-medium cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
