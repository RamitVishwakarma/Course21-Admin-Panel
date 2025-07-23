import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { useToast } from '@/components/ui/use-toast';
import { useCourseStore } from '@/store/useCourseStore';

export default function CreateModule({
  courseId,
  refreshPage,
}: {
  courseId: string;
  refreshPage: () => void;
}) {
  interface FormData {
    title: string;
    description: string;
    objectives: string[];
    isPublished: boolean;
    isPreview: boolean;
  }

  const [data, setData] = useState<FormData>({
    title: '',
    description: '',
    objectives: [''],
    isPublished: false,
    isPreview: false,
  });

  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { addModule } = useCourseStore();

  const handleFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setData({ ...data, [name]: checked });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...data.objectives];
    newObjectives[index] = value;
    setData({ ...data, objectives: newObjectives });
  };

  const addObjective = () => {
    setData({ ...data, objectives: [...data.objectives, ''] });
  };

  const removeObjective = (index: number) => {
    if (data.objectives.length > 1) {
      const newObjectives = data.objectives.filter((_, i) => i !== index);
      setData({ ...data, objectives: newObjectives });
    }
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      addModule(courseId, {
        title: data.title,
        description: data.description,
        courseId: courseId,
        order: 1, // Will be recalculated in the store
        duration: 0,
        lectureCount: 0,
        lectures: [],
        objectives: data.objectives.filter((obj) => obj.trim() !== ''),
        isPublished: data.isPublished,
        isPreview: data.isPreview,
        completionRate: 0,
        enrollmentCount: 0,
      });

      toast({
        title: 'Module created successfully',
      });

      // Reset form
      setData({
        title: '',
        description: '',
        objectives: [''],
        isPublished: false,
        isPreview: false,
      });

      setOpen(false);
      refreshPage();
    } catch (err) {
      toast({
        title: 'Failed to create module',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-6">
          <PlusCircleIcon className="h-5 w-5" />
          Add Module
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Create New Module</DialogTitle>
        <form onSubmit={formSubmitHandler} className="space-y-4">
          <div className="space-y-4">
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

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Learning Objectives
              </label>
              {data.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) =>
                      handleObjectiveChange(index, e.target.value)
                    }
                    placeholder={`Objective ${index + 1}`}
                    className="flex-1 rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {data.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addObjective}
                className="text-primary hover:underline"
              >
                + Add Objective
              </button>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={data.isPublished}
                  onChange={handleFormData}
                  className="mr-2"
                />
                <span className="text-black dark:text-white">Published</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPreview"
                  checked={data.isPreview}
                  onChange={handleFormData}
                  className="mr-2"
                />
                <span className="text-black dark:text-white">
                  Available as Preview
                </span>
              </label>
            </div>
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
              Create Module
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
