import React from 'react';
import { useState } from 'react';
import { IdentificationIcon, PencilIcon } from '@heroicons/react/20/solid';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useCourseStore } from '@/store/useCourseStore';

export default function UpdateCourse({
  courseId,
  name,
  image_path,
}: {
  courseId: number;
  name: string;
  image_path: string;
}) {
  const { toast } = useToast();
  const updateCourse = useCourseStore((state) => state.updateCourse);
  // const updateCourse = useCourseStore((state) => state.updateCourse);

  interface FormData {
    name: string;
    image_path: string | File;
    courseId: number;
  }

  const [data, setData] = useState<FormData>({
    name: name,
    image_path: image_path ? image_path : new File([], ''),
    courseId: courseId,
  });

  // Dialog state
  const [open, setOpen] = useState(false);
  // Upload state
  const [uploading, setUploading] = useState(false);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file') {
      handleImageUpload(e.target.files![0]);
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Function to handle image upload (mocked)
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);

    try {
      // Instead of uploading to server, create a mock path
      setTimeout(() => {
        const mockImagePath = `courses/${Math.random()
          .toString(36)
          .substring(2)}.png`;
        setData((prev) => ({ ...prev, image_path: mockImagePath }));
        toast({ title: 'Image Uploaded Successfully' });
        setUploading(false);
      }, 1000); // Simulate a delay
    } catch (error) {
      toast({
        title: 'Image Upload Failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
      setUploading(false);
    }
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Update course using Zustand store
      updateCourse(courseId.toString(), {
        title: data.name,
        thumbnail:
          typeof data.image_path === 'string'
            ? data.image_path
            : `courses/${Math.random().toString(36).substring(2)}.png`,
      });

      toast({
        title: 'Course Updated Successfully',
      });

      // Close dialog
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Update Failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PencilIcon className="h-4 w-4 cursor-pointer hover:text-primary" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Course</DialogTitle>
        <form onSubmit={formSubmitHandler}>
          {/* Course Name */}
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
                placeholder="Enter Course Name"
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
              Cover Image
            </label>
            <input
              type="file"
              name="featured_image"
              onChange={handleFormData}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            )}
          </div>

          {/* Current image path */}
          {typeof data.image_path === 'string' && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Current image: {data.image_path}
              </p>
            </div>
          )}

          <DialogFooter>
            <div className="mb-5">
              <input
                type="submit"
                value={uploading ? 'Uploading...' : 'Submit'}
                disabled={uploading}
                className="w-full font-medium cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
