import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
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

const ViewCourse: React.FC = () => {
  const id = useParams().id;
  const [course, setCourse] = useState<Course>();
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const { toast } = useToast();
  // Getting an array of module ids
  const moduleId = useMemo(() => modules.map((module) => module.id), [modules]);
  // getting the active module while dragging also for overlay
  const [activeModule, setActiveModule] = useState<Modules | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}courses/${id}`)
      .then((res) => {
        console.log(res.data);
        setCourse(res.data.data);
        setModules(res.data.data.modules);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, refresh]);

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

  const updateModuleSequence = (updatedModuleIds: number[]) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}courses/update-sequence`, {
        course_id: Number(id),
        module_ids: updatedModuleIds,
      })
      .then((res) => {
        toast({
          title: res.data.message,
        });
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          variant: 'destructive',
        });
      });
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
            <CreateModule courseId={Number(id)} refreshPage={refreshPage} />
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
                  courseId={Number(id)}
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
                    courseId={Number(id)}
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
      updateModuleSequence(updatedModuleIds);
      return updatedModules;
    });
  }
};

export default ViewCourse;
