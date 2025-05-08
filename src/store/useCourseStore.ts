import { create } from 'zustand';
import { CourseData } from '../data/courseData';

export interface Module {
  id: number;
  name: string;
  course_id: number;
  image_path: string | null;
  index: number | null;
  lectures: Lecture[];
}

export interface Lecture {
  id: number;
  course_id: number | null;
  prefix: string | null;
  name: string;
  file_id: string | null;
  is_trial: boolean | null;
  image_path: string | null;
  video_id: string;
  created_at: string;
  updated_at: string;
  index: number;
  module_id: number;
  transcodingjob?: {
    video_id: string | null;
    status: string;
  };
}

export interface Course {
  id: number;
  prefix: string | null;
  name: string;
  validity: string | null;
  manager: string | null;
  price: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category_id: number | null;
  modules: Module[];
}

interface CourseStore {
  courses: Course[];
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchCourses: () => void;
  fetchCourseById: (id: number) => Course | undefined;

  // CRUD operations
  addCourse: (
    course: Omit<
      Course,
      'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'modules'
    >,
  ) => void;
  updateCourse: (id: number, courseData: Partial<Course>) => void;
  deleteCourse: (id: number) => void;

  // Module operations
  addModule: (
    courseId: number,
    module: Omit<Module, 'id' | 'lectures'>,
  ) => void;
  updateModule: (moduleId: number, moduleData: Partial<Module>) => void;
  deleteModule: (moduleId: number) => void;
  updateModuleSequence: (modules: { id: number; index: number }[]) => void;

  // Lecture operations
  addLecture: (
    moduleId: number,
    lecture: Omit<Lecture, 'id' | 'created_at' | 'updated_at'>,
  ) => void;
  updateLecture: (lectureId: number, lectureData: Partial<Lecture>) => void;
  deleteLecture: (lectureId: number) => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: () => {
    set({ isLoading: true, error: null });
    try {
      // Instead of API call, use the local dummy data
      set({ courses: CourseData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch courses', isLoading: false });
    }
  },

  fetchCourseById: (id) => {
    return get().courses.find((course) => course.id === id);
  },

  addCourse: (courseData) => {
    const newId = Math.max(0, ...get().courses.map((course) => course.id)) + 1;
    const now = new Date().toISOString();

    const newCourse: Course = {
      id: newId,
      ...courseData,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      modules: [],
    };

    set((state) => ({
      courses: [...state.courses, newCourse],
    }));
  },

  updateCourse: (id, courseData) => {
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === id
          ? { ...course, ...courseData, updated_at: new Date().toISOString() }
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
    const newId =
      Math.max(
        0,
        ...get().courses.flatMap((course) =>
          course.modules.map((module) => module.id),
        ),
      ) + 1;

    const newModule: Module = {
      id: newId,
      ...moduleData,
      lectures: [],
    };

    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              modules: [...course.modules, newModule],
              updated_at: new Date().toISOString(),
            }
          : course,
      ),
    }));
  },

  updateModule: (moduleId, moduleData) => {
    set((state) => ({
      courses: state.courses.map((course) => {
        const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
        if (moduleIndex === -1) return course;

        const updatedModules = [...course.modules];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          ...moduleData,
        };

        return {
          ...course,
          modules: updatedModules,
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  },

  updateModuleSequence: (modules) => {
    set((state) => ({
      courses: state.courses.map((course) => {
        const courseModules = modules.filter((m) =>
          course.modules.some((cm) => cm.id === m.id),
        );

        if (courseModules.length === 0) return course;

        const updatedModules = course.modules.map((module) => {
          const sequenceItem = modules.find((m) => m.id === module.id);
          if (!sequenceItem) return module;
          return {
            ...module,
            index: sequenceItem.index,
          };
        });

        return {
          ...course,
          modules: updatedModules,
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  },

  deleteModule: (moduleId) => {
    set((state) => ({
      courses: state.courses.map((course) => {
        const hasModule = course.modules.some((m) => m.id === moduleId);
        if (!hasModule) return course;

        return {
          ...course,
          modules: course.modules.filter((m) => m.id !== moduleId),
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  },

  addLecture: (moduleId, lectureData) => {
    const newId =
      Math.max(
        0,
        ...get().courses.flatMap((course) =>
          course.modules.flatMap((module) =>
            module.lectures.map((lecture) => lecture.id),
          ),
        ),
      ) + 1;

    const now = new Date().toISOString();

    const newLecture: Lecture = {
      id: newId,
      ...lectureData,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      courses: state.courses.map((course) => ({
        ...course,
        modules: course.modules.map((module) => {
          if (module.id !== moduleId) return module;
          return {
            ...module,
            lectures: [...module.lectures, newLecture],
          };
        }),
        updated_at: module.id === moduleId ? now : course.updated_at,
      })),
    }));
  },

  updateLecture: (lectureId, lectureData) => {
    const now = new Date().toISOString();

    set((state) => ({
      courses: state.courses.map((course) => ({
        ...course,
        modules: course.modules.map((module) => {
          const lectureIndex = module.lectures.findIndex(
            (l) => l.id === lectureId,
          );
          if (lectureIndex === -1) return module;

          const updatedLectures = [...module.lectures];
          updatedLectures[lectureIndex] = {
            ...updatedLectures[lectureIndex],
            ...lectureData,
            updated_at: now,
          };

          return {
            ...module,
            lectures: updatedLectures,
          };
        }),
        updated_at: course.modules.some((m) =>
          m.lectures.some((l) => l.id === lectureId),
        )
          ? now
          : course.updated_at,
      })),
    }));
  },

  deleteLecture: (lectureId) => {
    const now = new Date().toISOString();

    set((state) => ({
      courses: state.courses.map((course) => ({
        ...course,
        modules: course.modules.map((module) => {
          const hasLecture = module.lectures.some((l) => l.id === lectureId);
          if (!hasLecture) return module;

          return {
            ...module,
            lectures: module.lectures.filter((l) => l.id !== lectureId),
          };
        }),
        updated_at: course.modules.some((m) =>
          m.lectures.some((l) => l.id === lectureId),
        )
          ? now
          : course.updated_at,
      })),
    }));
  },
}));
