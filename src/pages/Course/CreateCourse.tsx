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
import axios from 'axios';

export default function CreateCourse({
  refreshPage,
}: {
  refreshPage: () => void;
}) {
  const { toast } = useToast();

  interface FormData {
    name: string;
    price: number;
    featured_image: File;
  }

  const [data, setData] = useState<FormData>({
    name: '',
    price: 0,
    featured_image: new File([], ''),
  });
  // dialog state
  const [open, setOpen] = useState(false);

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
      .post(`${import.meta.env.VITE_BACKEND_URL}courses`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res);
        toast({
          title: 'Course Added Successfully',
        });
        refreshPage();
        setOpen(false);
        // alert('Course Added Successfully');
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Course Addition Failed',
          variant: 'destructive',
        });
        // alert('Course Addition Failed');
      });
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
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                type="text"
                name="price"
                onChange={handleFormData}
                placeholder="Enter Course Price"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
