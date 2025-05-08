import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useCourseStore } from '@/store/useCourseStore';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';
import DefaultLayout from '@/layout/DefaultLayout';
import Loader from '@/common/Loader';

export default function ViewModule() {
  // Get URL parameters
  const { courseId: courseIdParam, moduleId: moduleIdParam } = useParams();
  const courseId = Number(courseIdParam);
  const moduleId = Number(moduleIdParam);

  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Get functions and data from our Zustand store
  const { courses, fetchCourses, updateModuleSequence } = useCourseStore(
    (state) => ({
      courses: state.courses,
      fetchCourses: state.fetchCourses,
      updateModuleSequence: state.updateModuleSequence,
    }),
  );

  useEffect(() => {
    // Load courses if not already loaded
    if (courses.length === 0) {
      fetchCourses();
    } else {
      // Find the course with the matching ID
      const course = courses.find((course) => course.id === courseId);
      if (course) {
        // Find the specific module we want to view
        const module = course.modules.find((m) => m.id === moduleId);
        if (module) {
          setModules([module]);
        }
      }
      setLoading(false);
    }
  }, [courseId, moduleId, courses, fetchCourses]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the index values
    const updatedItems = items.map((item, index) => ({
      ...item,
      index: index + 1, // 1-based index
    }));

    setModules(updatedItems);

    // Prepare data for the store update
    const moduleSequence = updatedItems.map((module) => ({
      id: module.id,
      index: module.index,
    }));

    try {
      // Update sequence in the store
      updateModuleSequence(moduleSequence);
      toast({
        title: 'Module sequence updated successfully',
      });
    } catch (error) {
      console.error(error);
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
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h1 className="text-2xl font-bold mb-4">Module View</h1>
        <div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="modules">
              {(provided) => (
                <div
                  className="flex flex-col space-y-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {modules.map((module, index) => (
                    <Draggable
                      key={module.id}
                      draggableId={module.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative flex flex-wrap justify-between gap-2.5 rounded-lg border border-stroke bg-white py-3 px-6.5 hover:shadow-default dark:border-strokedark dark:bg-boxdark dark:hover:shadow-default"
                        >
                          <div className="flex flex-col">
                            <h2 className="text-xl font-semibold">
                              {module.name}
                            </h2>
                            {module.lectures && module.lectures.length > 0 && (
                              <div className="mt-4">
                                <h3 className="text-lg font-medium mb-2">
                                  Lectures:
                                </h3>
                                <ul className="list-disc pl-5">
                                  {module.lectures.map((lecture: any) => (
                                    <li key={lecture.id} className="mb-2">
                                      {lecture.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </DefaultLayout>
  );
}
