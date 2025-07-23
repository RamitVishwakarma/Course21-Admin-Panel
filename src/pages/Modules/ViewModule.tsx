import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { type Module, type Lecture } from '../../types';
import { createPortal } from 'react-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import Loader from '../../components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { useCourseStore } from '@/store/useCourseStore';
import LectureCard from './LectureCard';
import CreateLecture from '../Lectures/CreateLecture';

const ViewModule: React.FC = () => {
  const { moduleId, courseId } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const { toast } = useToast();

  const { fetchCourses, fetchLecturesByModuleId, updateLectureSequence } =
    useCourseStore();

  // Getting an array of lecture ids for drag and drop
  const lectureIds = lectures.map((lecture) => lecture.id);

  useEffect(() => {
    const loadModuleData = async () => {
      setLoading(true);

      // Load courses if not already loaded
      await fetchCourses();

      if (moduleId) {
        // Re-fetch modules after courses are loaded
        const { modules: currentModules } = useCourseStore.getState();

        // Find the module
        const foundModule = currentModules.find((m) => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);

          // Get lectures for this module
          const moduleLectures = fetchLecturesByModuleId(moduleId);
          setLectures(moduleLectures);
        } else {
          toast({
            title: 'Module not found',
            description: `Module ${moduleId} could not be found in course ${courseId}`,
            variant: 'destructive',
          });
        }
      }

      setLoading(false);
    };

    loadModuleData();
  }, [moduleId, courseId, fetchCourses, fetchLecturesByModuleId, toast]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeLectureData = lectures.find(
      (lecture) => lecture.id === active.id,
    );
    setActiveLecture(activeLectureData || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLecture(null);

    if (!over || active.id === over.id) return;

    const oldIndex = lectures.findIndex((lecture) => lecture.id === active.id);
    const newIndex = lectures.findIndex((lecture) => lecture.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newLectureOrder = arrayMove(lectures, oldIndex, newIndex);
      const newLectureIds = newLectureOrder.map((lecture) => lecture.id);

      setLectures(newLectureOrder);

      // Update the module store with new lecture sequence
      if (moduleId) {
        updateLectureSequence(moduleId, newLectureIds);

        toast({
          title: 'Lecture sequence updated successfully',
        });
      }
    }
  };

  const refreshPage = () => {
    if (moduleId) {
      const moduleLectures = fetchLecturesByModuleId(moduleId);
      setLectures(moduleLectures);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-4">
        {/* Module Header */}
        {module && (
          <div className="border-b border-stroke py-4 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">
                  {module.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {module.description}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{module.lectureCount} lectures</span>
                  <span>
                    {Math.floor(module.duration / 60)}h {module.duration % 60}m
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      module.isPublished
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {module.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lectures Section */}
        <div className="border-b font-semibold border-stroke py-4.5 px-4 text-black dark:text-white dark:border-stroke/20 md:px-6 2xl:px-7.5">
          <div className="flex text-xl items-center justify-between">
            <p className="font-medium text-2xl">Lectures</p>
            {moduleId && (
              <CreateLecture moduleId={moduleId} refreshPage={refreshPage} />
            )}
          </div>
        </div>

        {lectures.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No lectures in this module yet.</p>
            <p className="text-sm mt-1">
              Add your first lecture to get started.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={lectureIds}>
              {lectures.map((lecture, index) => (
                <div key={lecture.id} className="m-4">
                  <LectureCard
                    lecture={lecture}
                    index={index}
                    refreshPage={refreshPage}
                    moduleId={moduleId || ''}
                  />
                </div>
              ))}
            </SortableContext>
            {createPortal(
              <div className="text-bodydark">
                <DragOverlay>
                  {activeLecture && (
                    <LectureCard
                      lecture={activeLecture}
                      index={0}
                      refreshPage={refreshPage}
                      moduleId={moduleId || ''}
                    />
                  )}
                </DragOverlay>
              </div>,
              document.body,
            )}
          </DndContext>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ViewModule;
