import { Dialog, Transition } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Fragment, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLectureStore } from '@/store/useLectureStore';

export default function DeleteLecture({
  lectureId,
  refresh,
}: {
  lectureId: number;
  refresh: () => void;
}) {
  let [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Get delete function from lecture store
  const deleteLectureFromStore = useLectureStore(
    (state) => state.deleteLecture,
  );
  const fetchLectures = useLectureStore((state) => state.fetchLectures);

  // Ensure lectures are loaded
  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleDeleteLecture = () => {
    try {
      // Delete the lecture from our store
      deleteLectureFromStore(lectureId);

      toast({
        title: 'Lecture deleted successfully',
      });

      refresh();
      closeModal();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Lecture deletion failed',
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
          className="inline-flex text-lg items-center justify-center gap-2.5 rounded-full bg-meta-1 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-6"
        >
          <TrashIcon className="h-4 w-4 cursor-pointer" />
          Delete
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 dark:text-white"
                  >
                    Delete Lecture?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm bg-opacity-10">
                      Do you really want to delete this Lecture?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleDeleteLecture}
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
