import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../../layout/DefaultLayout';
import axios from 'axios';
import { useState, useEffect } from 'react';

import CreateModule from '../../Modules/CreateModule';
import { Course } from '../../../interfaces/Course';
import Loader from '../../../common/Loader';

import CourseContainer from './CourseContainer';
import ViewModules from './ViewModules';

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
import { createPortal } from 'react-dom';

const ViewCourse: React.FC = () => {
  const id = useParams().id;
  const [course, setCourse] = useState<Course>();
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);

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
  // Getting an array of module ids
  const moduleId = useMemo(() => modules.map((module) => module.id), [modules]);
  // getting the active module while dragging also for overlay
  const [activeModule, setActiveModule] = useState<Modules | null>(null);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-4">
        {/* Course Description */}
        {course && <CourseContainer course={course} />}
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
              <div className="m-4">
                <ViewModules
                  key={index} // just for show
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
                  <ViewModules
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
      // console.log(activeModuleIndex, overModuleIndex);
      return arrayMove(module, activeModuleIndex, overModuleIndex);
    });
  }
};

export default ViewCourse;
