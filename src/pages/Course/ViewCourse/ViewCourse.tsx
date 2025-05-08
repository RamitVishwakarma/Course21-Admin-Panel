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
import { Modules } from '@/interfaces/Modules';
import { Course } from '../../../interfaces/Course';
import { createPortal } from 'react-dom';
import CourseCard from './CourseCard';
import ModuleCard from './ModuleCard';
import DefaultLayout from '../../../layout/DefaultLayout';
import CreateModule from '../../Modules/CreateModule';
import Loader from '../../../common/Loader';
import { useToast } from '@/components/ui/use-toast';
import { useCourseStore } from '@/store/useCourseStore';

const ViewCourse: React.FC = () => {
  const id = Number(useParams().id);
  const [course, setCourse] = useState<Course>();
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const { toast } = useToast();

  // Get data and functions from our Zustand store
  const { courses, fetchCourses, updateModuleSequence } = useCourseStore(
    (state) => ({
      courses: state.courses,
      fetchCourses: state.fetchCourses,
      updateModuleSequence: state.updateModuleSequence,
    }),
  );

  // Getting an array of module ids
  const moduleId = useMemo(() => modules.map((module) => module.id), [modules]);
  // getting the active module while dragging also for overlay
  const [activeModule, setActiveModule] = useState<Modules | null>(null);

  useEffect(() => {
    // Load courses if not already loaded
    if (courses.length === 0) {
      fetchCourses();
      setLoading(true);
    } else {
      // Find the course with the matching ID
      const foundCourse = courses.find((c) => c.id === id);
      if (foundCourse) {
        setCourse(foundCourse);

        // Sort modules by index
        const sortedModules = [...foundCourse.modules].sort((a, b) => {
          // Handle null indexes by placing them at the end
          if (a.index === null) return 1;
          if (b.index === null) return -1;
          return a.index - b.index;
        });

        setModules(sortedModules);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [id, courses, fetchCourses, refresh]);

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

  const handleUpdateModuleSequence = (updatedModuleIds: number[]) => {
    try {
      // Create array of objects with id and index for the store update
      const moduleSequence = updatedModuleIds.map((id, index) => ({
        id,
        index: index + 1, // 1-based index
      }));

      // Update sequence in Zustand store
      updateModuleSequence(moduleSequence);

      toast({
        title: 'Module sequence updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Failed to update module sequence',
        variant: 'destructive',
      });
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
            <CreateModule courseId={id} refreshPage={refreshPage} />
          </div>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={moduleId}>
            {modules.map((module, index) => (
              <div key={index} className="m-4">
                <ModuleCard
                  module={module}
                  index={module.id}
                  refreshPage={refreshPage}
                  courseId={id}
                />
              </div>
            ))}
          </SortableContext>
          {createPortal(
            <div className="text-bodydark">
              <DragOverlay>
                {activeModule && (
                  <ModuleCard
                    index={activeModule.id}
                    module={activeModule}
                    refreshPage={refreshPage}
                    courseId={id}
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

  function onDragStart(event: DragStartEvent) {
    // console.log(event.active.data.current?.module);
    if (event.active.data.current?.type === 'module') {
      setActiveModule(event.active.data.current.module);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // if there is no over then return
    if (!over) return;
    // getting the id of the module that was dragged and the one that it was dragged over
    const activeId = active.id;
    const overId = over.id;
    // if the ids are same then return
    if (activeId === overId) return;
    setModules((module) => {
      const activeModuleIndex = module.findIndex(
        (module) => module.id === activeId,
      );
      const overModuleIndex = module.findIndex(
        (module) => module.id === overId,
      );
      const updatedModules = arrayMove(
        module,
        activeModuleIndex,
        overModuleIndex,
      );
      const updatedModuleIds: number[] = updatedModules.map(
        (module) => module.id,
      );
      handleUpdateModuleSequence(updatedModuleIds);
      return updatedModules;
    });
  }
};

export default ViewCourse;
