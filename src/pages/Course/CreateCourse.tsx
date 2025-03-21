import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  CurrencyRupeeIcon,
  IdentificationIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import useUserStore from '@/store/userStore';

export default function CreateCourse() {
  const { toast } = useToast();
  const { addCourse } = useUserStore();

  interface FormData {
    name: string;
    price: number;
    image_path: string;
  }

  const [data, setData] = useState<FormData>({
    name: '',
    price: 0,
    image_path: '',
  });

  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Handle form input changes
  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'file') {
      uploadToCloudinary(e.target.files![0]);
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Function to upload image to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = 'Course21';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'Course21');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const result = await res.json();
      if (result.secure_url) {
        setData((prev) => ({ ...prev, image_path: result.secure_url }));
        toast({ title: 'Image Uploaded Successfully', variant: 'success' });
      }
    } catch (error) {
      toast({
        title: 'Image Upload Failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Form submission handler
  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.image_path) {
      toast({
        title: 'Please upload an image before submitting.',
        variant: 'destructive',
      });
      return;
    }

    addCourse({
      ...data,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    toast({ title: 'Course Added Successfully' });
    refreshPage();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="m-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-meta-3 py-4 px-6 text-center font-medium text-white hover:bg-opacity-80 lg:px-6 xl:px-8">
          <PlusCircleIcon className="h-5 w-5" />
          Create New
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Course</DialogTitle>
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
                onChange={handleFormData}
                placeholder="Enter Course Name"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                required
              />
              <span className="absolute right-4 top-4">
                <IdentificationIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Course Price
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                onChange={handleFormData}
                placeholder="Enter Course Price"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                required
              />
              <span className="absolute right-4 top-4">
                <CurrencyRupeeIcon className="w-6 h-6 text-bodydark" />
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
              name="image_path"
              onChange={handleFormData}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white"
              accept="image/*"
              required
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            )}
          </div>

          {/* Preview Image */}
          {data.image_path && (
            <div className="mb-4">
              <img
                src={data.image_path}
                alt="Preview"
                className="size-60 rounded-lg"
              />
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
