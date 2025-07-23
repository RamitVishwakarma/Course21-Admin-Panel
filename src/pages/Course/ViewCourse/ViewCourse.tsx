import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
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
import { type Module, type Course } from '../../../types';
import { createPortal } from 'react-dom';
import CourseCard from './CourseCard';
import ModuleCard from './ModuleCard';
import DefaultLayout from '../../../layout/DefaultLayout';
import CreateModule from '../../Modules/CreateModule';
import Loader from '../../../components/ui/loader';
import { useToast } from '@/components/ui/use-toast';
import { useCourseStore } from '@/store/useCourseStore';

const ViewCourse: React.FC = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const { toast } = useToast();

  const {
    courses,
    fetchCourses,
    fetchCourseById,
    fetchModulesByCourseId,
    updateModuleSequence,
  } = useCourseStore();

  // Getting an array of module ids for drag and drop
  const moduleIds = useMemo(
    () => modules.map((module) => module.id),
    [modules],
  );
  // getting the active module while dragging also for overlay
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);

      // Load courses if not already loaded
      if (courses.length === 0) {
        await fetchCourses();
      }

      if (id) {
        // Find the course
        const foundCourse = fetchCourseById(id);
        if (foundCourse) {
          setCourse(foundCourse);

          // Get modules for this course
          const courseModules = fetchModulesByCourseId(id);
          setModules(courseModules);
        } else {
          toast({
            title: 'Course not found',
            variant: 'destructive',
          });
        }
      }

      setLoading(false);
    };

    loadCourseData();
  }, [
    id,
    courses,
    refresh,
    fetchCourses,
    fetchCourseById,
    fetchModulesByCourseId,
    toast,
  ]);

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeModuleData = modules.find((module) => module.id === active.id);
    setActiveModule(activeModuleData || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveModule(null);

    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((module) => module.id === active.id);
    const newIndex = modules.findIndex((module) => module.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newModuleOrder = arrayMove(modules, oldIndex, newIndex);
      const newModuleIds = newModuleOrder.map((module) => module.id);

      setModules(newModuleOrder);

      // Update the course store with new module sequence
      if (course?.id) {
        updateModuleSequence(course.id, newModuleIds);

        toast({
          title: 'Module sequence updated successfully',
        });
      }
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-4">
        {/* Course Description */}
        {course && <CourseCard course={course} />}
        {/* Module Creation */}
        <div className="border-y font-semibold border-stroke py-4.5 px-4  text-black dark:text-white dark:border-stroke/20 md:px-6 2xl:px-7.5">
          <div className="flex text-xl items-center justify-between">
            <p className="font-medium text-3xl">Modules</p>
            {id && <CreateModule courseId={id} refreshPage={refreshPage} />}
          </div>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={moduleIds}>
            {modules.map((module, index) => (
              <div key={module.id} className="m-4">
                <ModuleCard
                  module={module}
                  index={index}
                  refreshPage={refreshPage}
                  courseId={id || ''}
                />
              </div>
            ))}
          </SortableContext>
          {createPortal(
            <div className="text-bodydark">
              <DragOverlay>
                {activeModule && (
                  <ModuleCard
                    index={0}
                    module={activeModule}
                    refreshPage={refreshPage}
                    courseId={id || ''}
                  />
                )}
              </DragOverlay>
            </div>,
            document.body,
          )}
        </DndContext>
      </div>
    </DefaultLayout>
  );
};

export default ViewCourse;
