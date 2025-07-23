import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/20/solid';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useCourseStore } from '@/store/useCourseStore';

export default function UpdateModule({
  courseId,
  moduleId,
  title,
  description,
  refresh,
}: {
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  refresh: () => void;
}) {
  const { toast } = useToast();
  const { updateModule } = useCourseStore();

  interface FormData {
    title: string;
    description: string;
  }

  const [data, setData] = useState<FormData>({
    title: title || '',
    description: description || '',
  });

  const [open, setOpen] = useState(false);

  const handleFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      updateModule(moduleId, {
        title: data.title,
        description: data.description,
      });

      toast({
        title: 'Module updated successfully',
      });

      setOpen(false);
      refresh();
    } catch (err) {
      toast({
        title: 'Failed to update module',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors">
          <PencilIcon className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogTitle>Update Module</DialogTitle>
        <form onSubmit={formSubmitHandler} className="space-y-4">
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Module Title
            </label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleFormData}
              placeholder="Enter module title"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleFormData}
              placeholder="Enter module description"
              rows={4}
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Update Module
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
