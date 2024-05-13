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
import { createPortal } from 'react-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import Loader from '../../common/Loader';
import { useToast } from '@/components/ui/use-toast';
import CreateLecture from '../Lectures/CreateLecture';
import { Lectures } from '@/interfaces/Lectures';
import ModuleContainer from './ModuleContainer';
import LectureView from './LectureView';

export default function ViewModule() {
  const id = Number(useParams().id);
  const [module, setModule] = useState<Modules>();
  const [lectures, setLectures] = useState<Lectures[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const { toast } = useToast();
  const [activeLecture, setActiveLecture] = useState<Lectures>();

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
  const lectureId = useMemo(
    () => lectures.map((module) => module.id),
    [lectures],
  );

  const updateLectureSequence = () => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}modules/${id}`, {
        module_id: id,
        lecture_ids: lectureId,
      })
      .then((res) => {
        toast({
          title: 'Lecture sequence updated',
        });
      })
      .catch((err) => {
        toast({
          title: 'Failed to update lecture sequence',
          variant: 'destructive',
        });
      });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}modules/${id}`) //? need to fix this later
      .then((res) => {
        // console.log(res.data.data.modules[0].lectures);
        console.log(res.data.data.modules[0]);
        console.log(res.data.data.modules[0].lectures);
        setModule(res.data.data.modules[0]);
        setLectures(res.data.data.modules[0].lectures);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, refresh]);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-4">
        {/* Course Description */}
        {module && <ModuleContainer module={module} />}
        {/* Module Creation */}
        <div className="border-y font-semibold border-stroke py-4.5 px-4  text-black dark:text-white dark:border-stroke/20 md:px-6 2xl:px-7.5">
          <div className="flex text-xl items-center justify-between">
            <p className="font-medium text-3xl">Modules</p>
            <CreateLecture moduleId={Number(id)} refreshPage={refreshPage} />
          </div>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={lectureId}>
            {lectures.map((lecture, index) => (
              <div key={index} className="m-4">
                <LectureView
                  lecture={lecture}
                  index={lecture.id}
                  moduleId={id}
                  courseId={module?.course_id}
                  refreshPage={refreshPage}
                />
              </div>
            ))}
          </SortableContext>
          {createPortal(
            <div className="text-bodydark">
              <DragOverlay>
                {activeLecture && (
                  <LectureView
                    index={activeLecture.id}
                    lecture={activeLecture}
                    moduleId={id}
                    courseId={module?.course_id}
                    refreshPage={refreshPage}
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
      setActiveLecture(event.active.data.current.module);
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
    setLectures((lecture) => {
      const activeLectureIndex = lecture.findIndex(
        (lecture) => lecture.id === activeId,
      );
      const overLectureIndex = lecture.findIndex(
        (lecture) => lecture.id === overId,
      );
      // console.log(activelectureIndex, overlectureIndex);
      return arrayMove(lecture, activeLectureIndex, overLectureIndex);
    });
    updateLectureSequence();
  }
}
