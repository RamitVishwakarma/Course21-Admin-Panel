import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CourseData from '../data/courseData';
import { Course } from '../interfaces/Course';

const courseData: any[] = CourseData;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      courses: courseData,
      page: {
        pageNo: 1,
        totalPages: Math.ceil(courseData.length / 10),
        limit: 10,
      },

      setUser: (userData) => set(() => ({ user: userData })),
      clearUser: () => set(() => ({ user: null })),

      setCourses: (courseData) => {
        const limit = get().page.limit;
        const totalPages = Math.ceil(courseData.length / limit);
        set(() => ({
          courses: courseData,
          page: { pageNo: 1, totalPages, limit },
        }));
      },

      addCourse: (course) => {
        const newCourse: Course = {
          id: Math.floor(10000000 + Math.random() * 90000000),
          ...course,
        };
        set((state) => ({
          courses: [...state.courses, newCourse],
          page: {
            ...state.page,
            totalPages: Math.ceil(
              (state.courses.length + 1) / state.page.limit,
            ),
          },
        }));
      },

      setPage: (pageData) =>
        set((state) => ({ page: { ...state.page, ...pageData } })),

      handleNext: () =>
        set((state) => {
          if (state.page.pageNo < state.page.totalPages) {
            return { page: { ...state.page, pageNo: state.page.pageNo + 1 } };
          }
          return {};
        }),

      handlePrevious: () =>
        set((state) => {
          if (state.page.pageNo > 1) {
            return { page: { ...state.page, pageNo: state.page.pageNo - 1 } };
          }
          return {};
        }),

      getPaginatedCourses: () => {
        const { courses, page } = get();
        const startIdx = (page.pageNo - 1) * page.limit;
        const endIdx = startIdx + page.limit;
        return courses.slice(startIdx, endIdx);
      },
    }),
    {
      name: 'user-storage',
    },
  ),
);

export default useUserStore;

interface Pagination {
  pageNo: number;
  totalPages: number;
  limit: number;
}

interface UserStore {
  user: any | null;
  courses: Course[];
  page: Pagination;

  setUser: (email: string) => void;
  clearUser: () => void;

  setCourses: (courseData: Course[]) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;

  setPage: (pageData: Partial<Pagination>) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  getPaginatedCourses: () => Course[];
}
