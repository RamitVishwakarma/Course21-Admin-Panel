import { Dialog, Transition } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Fragment, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useCourseStore } from '@/store/useCourseStore';

export default function DeleteCourse({ courseId }: { courseId: number }) {
  let [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Get the deleteCourse function from our Zustand store
  const deleteCourse = useCourseStore((state) => state.deleteCourse);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleDeleteCourse = () => {
    try {
      // Delete course from the Zustand store
      deleteCourse(courseId);

      toast({
        title: 'Course deleted successfully',
      });

      closeModal();

      // Force page refresh to show updated data
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Course deletion failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="hover:text-primary"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 dark:text-white"
                  >
                    Delete Course?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm bg-opacity-10">
                      Do you really want to delete this course?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleDeleteCourse}
                      className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-2 xl:px-6"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
