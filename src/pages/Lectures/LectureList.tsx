import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useLectureStore } from '../../store/useLectureStore';
import { useModuleStore } from '../../store/useModuleStore';
import { useCourseStore } from '../../store/useCourseStore';
import { useUserStore } from '../../store/useUserStore';
import LectureCard from '../Modules/LectureCard';
import CreateLecture from './CreateLecture';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  PlusIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { Lecture } from '../../types/Lectures';

interface LectureListProps {
  moduleId?: string;
}

export default function LectureList({
  moduleId: propModuleId,
}: LectureListProps) {
  const { moduleId: paramModuleId, courseId } = useParams<{
    moduleId: string;
    courseId: string;
  }>();
  const moduleId = propModuleId || paramModuleId;

  const { lectures, updateLectureOrder, fetchLecturesByModuleId } =
    useLectureStore();
  const { fetchModuleById } = useModuleStore();
  const { fetchCourseById } = useCourseStore();
  const { user: currentUser } = useUserStore();

  const [moduleLectures, setModuleLectures] = useState<Lecture[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const module = moduleId ? fetchModuleById(moduleId) : null;
  const course = courseId ? fetchCourseById(courseId) : null;

  // Configure drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (moduleId) {
      setIsLoading(true);
      const lecturesForModule = fetchLecturesByModuleId(moduleId);
      setModuleLectures(lecturesForModule);
      setIsLoading(false);
    }
  }, [moduleId, lectures, fetchLecturesByModuleId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && moduleId) {
      const oldIndex = moduleLectures.findIndex(
        (lecture) => lecture.id === active.id,
      );
      const newIndex = moduleLectures.findIndex(
        (lecture) => lecture.id === over.id,
      );

      const newOrder = arrayMove(moduleLectures, oldIndex, newIndex);
      setModuleLectures(newOrder);

      // Update the order in the store
      const newOrderIds = newOrder.map((lecture) => lecture.id);
      updateLectureOrder(moduleId, newOrderIds);
    }
  };

  const calculateModuleStats = () => {
    const totalDuration = moduleLectures.reduce(
      (acc, lecture) => acc + (lecture.videoDuration || 0),
      0,
    );
    const completedLectures = moduleLectures.filter((lecture) => {
      // Check if current user has completed this lecture
      const { getLectureCompletion } = useLectureStore.getState();
      const completion = getLectureCompletion(
        lecture.id,
        currentUser?.id || '',
      );
      return completion?.completed;
    }).length;

    return {
      totalLectures: moduleLectures.length,
      totalDuration: Math.round(totalDuration / 60), // Convert seconds to minutes
      completedLectures,
      completionRate:
        moduleLectures.length > 0
          ? Math.round((completedLectures / moduleLectures.length) * 100)
          : 0,
    };
  };

  const stats = calculateModuleStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lecture Management
          </h1>
          {module && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Managing lectures for:{' '}
              <span className="font-semibold">{module.title}</span>
            </p>
          )}
          {course && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Course: {course.title}
            </p>
          )}
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
          disabled={!moduleId}
        >
          <PlusIcon className="h-4 w-4" />
          Add Lecture
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <AcademicCapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Lectures
                </p>
                <p className="text-xl font-bold">{stats.totalLectures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <ClockIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Duration
                </p>
                <p className="text-xl font-bold">{stats.totalDuration}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <UserGroupIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-xl font-bold">{stats.completedLectures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <PlayIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completion Rate
                </p>
                <p className="text-xl font-bold">{stats.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lectures List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AcademicCapIcon className="h-5 w-5" />
            Lectures
            <Badge variant="secondary" className="ml-2">
              {moduleLectures.length} lectures
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {moduleLectures.length === 0 ? (
            <div className="text-center py-12">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No lectures yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by creating your first lecture for this module.
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                disabled={!moduleId}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create First Lecture
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={moduleLectures.map((lecture) => lecture.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {moduleLectures.map((lecture, index) => (
                    <LectureCard
                      key={lecture.id}
                      lecture={lecture}
                      index={index}
                      refreshPage={() => {
                        const updatedLectures = fetchLecturesByModuleId(
                          moduleId!,
                        );
                        setModuleLectures(updatedLectures);
                      }}
                      moduleId={moduleId!}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Create Lecture Dialog */}
      {showCreateDialog && moduleId && (
        <CreateLecture
          moduleId={moduleId}
          refreshPage={() => {
            const updatedLectures = fetchLecturesByModuleId(moduleId);
            setModuleLectures(updatedLectures);
            setShowCreateDialog(false);
          }}
        />
      )}
    </div>
  );
}
