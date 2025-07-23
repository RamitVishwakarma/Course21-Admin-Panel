import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleCourses } from '../data/sample/courses';
import { sampleModules } from '../data/sample/modules';
import { sampleLectures } from '../data/sample/lectures';
import { type Course, type Module, type Lecture } from '../types';

// Re-export types for convenience
export type { Course, Module, Lecture };

interface CourseStore {
  courses: Course[];
  modules: Module[];
  lectures: Lecture[];
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Course | undefined;
  fetchModulesByCourseId: (courseId: string) => Module[];
  fetchLecturesByModuleId: (moduleId: string) => Lecture[];

  // CRUD operations
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, courseData: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Module operations
  addModule: (
    courseId: string,
    module: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  updateModule: (moduleId: string, moduleData: Partial<Module>) => void;
  deleteModule: (moduleId: string) => void;
  updateModuleSequence: (courseId: string, moduleIds: string[]) => void;

  // Lecture operations
  addLecture: (
    moduleId: string,
    lecture: Omit<Lecture, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  updateLecture: (lectureId: string, lectureData: Partial<Lecture>) => void;
  deleteLecture: (lectureId: string) => void;
  updateLectureSequence: (moduleId: string, lectureIds: string[]) => void;
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],
      modules: [],
      lectures: [],
      isLoading: false,
      error: null,

      fetchCourses: async () => {
        const currentCourses = get().courses;
        if (currentCourses.length === 0) {
          // First load: populate from sample data
          set({
            courses: sampleCourses,
            modules: sampleModules,
            lectures: sampleLectures,
            isLoading: false,
          });
        }
        // Subsequent calls do nothing - data already in localStorage
      },

      fetchCourseById: (id) => {
        return get().courses.find((course) => course.id === id);
      },

      fetchModulesByCourseId: (courseId) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return [];
        return get().modules.filter((module) =>
          course.modules.includes(module.id),
        );
      },

      fetchLecturesByModuleId: (moduleId) => {
        const module = get().modules.find((m) => m.id === moduleId);
        if (!module) return [];
        return get().lectures.filter((lecture) =>
          module.lectures.includes(lecture.id),
        );
      },

      addCourse: (courseData) => {
        const courses = get().courses;
        const newId =
          courses.length > 0
            ? (Math.max(...courses.map((c) => parseInt(c.id))) + 1).toString()
            : '1';
        const now = new Date().toISOString();

        const newCourse: Course = {
          id: newId,
          ...courseData,
          createdAt: now,
          updatedAt: now,
          modules: [],
          moduleCount: 0,
          lectureCount: 0,
          totalEnrollments: 0,
          completionRate: 0,
          averageRating: 0,
          totalRevenue: 0,
        };

        set((state) => ({
          courses: [...state.courses, newCourse],
        }));
      },

      updateCourse: (id, courseData) => {
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === id
              ? {
                  ...course,
                  ...courseData,
                  updatedAt: new Date().toISOString(),
                }
              : course,
          ),
        }));
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== id),
        }));
      },

      addModule: (courseId, moduleData) => {
        const modules = get().modules;
        const newId =
          modules.length > 0
            ? (Math.max(...modules.map((m) => parseInt(m.id))) + 1).toString()
            : '1';
        const now = new Date().toISOString();

        const newModule: Module = {
          id: newId,
          ...moduleData,
          createdAt: now,
          updatedAt: now,
          lectures: [],
          lectureCount: 0,
        };

        set((state) => ({
          modules: [...state.modules, newModule],
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  modules: [...course.modules, newId],
                  moduleCount: course.moduleCount + 1,
                  updatedAt: now,
                }
              : course,
          ),
        }));
      },

      updateModule: (moduleId, moduleData) => {
        const now = new Date().toISOString();

        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, ...moduleData, updatedAt: now }
              : module,
          ),
        }));
      },

      deleteModule: (moduleId) => {
        const now = new Date().toISOString();

        set((state) => ({
          modules: state.modules.filter((m) => m.id !== moduleId),
          courses: state.courses.map((course) => {
            const hasModule = course.modules.includes(moduleId);
            if (!hasModule) return course;

            return {
              ...course,
              modules: course.modules.filter((id) => id !== moduleId),
              moduleCount: Math.max(0, course.moduleCount - 1),
              updatedAt: now,
            };
          }),
        }));
      },

      updateModuleSequence: (courseId, moduleIds) => {
        const now = new Date().toISOString();

        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? { ...course, modules: moduleIds, updatedAt: now }
              : course,
          ),
        }));
      },

      addLecture: (moduleId, lectureData) => {
        const lectures = get().lectures;
        const newId =
          lectures.length > 0
            ? (Math.max(...lectures.map((l) => parseInt(l.id))) + 1).toString()
            : '1';
        const now = new Date().toISOString();

        const newLecture: Lecture = {
          id: newId,
          ...lectureData,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          lectures: [...state.lectures, newLecture],
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? {
                  ...module,
                  lectures: [...module.lectures, newId],
                  lectureCount: module.lectureCount + 1,
                  updatedAt: now,
                }
              : module,
          ),
        }));
      },

      updateLecture: (lectureId, lectureData) => {
        const now = new Date().toISOString();

        set((state) => ({
          lectures: state.lectures.map((lecture) =>
            lecture.id === lectureId
              ? { ...lecture, ...lectureData, updatedAt: now }
              : lecture,
          ),
        }));
      },

      deleteLecture: (lectureId) => {
        const now = new Date().toISOString();

        set((state) => ({
          lectures: state.lectures.filter((l) => l.id !== lectureId),
          modules: state.modules.map((module) => {
            const hasLecture = module.lectures.includes(lectureId);
            if (!hasLecture) return module;

            return {
              ...module,
              lectures: module.lectures.filter((id) => id !== lectureId),
              lectureCount: Math.max(0, module.lectureCount - 1),
              updatedAt: now,
            };
          }),
        }));
      },

      updateLectureSequence: (moduleId, lectureIds) => {
        const now = new Date().toISOString();

        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, lectures: lectureIds, updatedAt: now }
              : module,
          ),
        }));
      },
    }),
    {
      name: 'course-store', // localStorage key
    },
  ),
);
