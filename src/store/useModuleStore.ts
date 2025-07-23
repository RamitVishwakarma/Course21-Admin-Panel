import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleModules } from '../data/sample/modules';
import { type Module } from '../types';

interface ModuleStore {
  modules: Module[];
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchModules: () => Promise<void>;
  fetchModuleById: (id: string) => Module | undefined;
  fetchModulesByCourseId: (courseId: string) => Module[];

  // CRUD operations
  addModule: (
    moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  updateModule: (id: string, moduleData: Partial<Module>) => void;
  deleteModule: (id: string) => void;
  updateModuleOrder: (courseId: string, moduleIds: string[]) => void;

  // Lecture management within modules
  addLectureToModule: (moduleId: string, lectureId: string) => void;
  removeLectureFromModule: (moduleId: string, lectureId: string) => void;
  updateLectureOrder: (moduleId: string, lectureIds: string[]) => void;
}

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      modules: [],
      isLoading: false,
      error: null,

      fetchModules: async () => {
        const currentModules = get().modules;
        if (currentModules.length === 0) {
          // First load: populate from sample data
          set({ modules: sampleModules, isLoading: false });
        }
        // Subsequent calls do nothing - data already in localStorage
      },

      fetchModuleById: (id) => {
        return get().modules.find((module) => module.id === id);
      },

      fetchModulesByCourseId: (courseId) => {
        return get().modules.filter((module) => module.courseId === courseId);
      },

      addModule: (moduleData) => {
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
        }));
      },

      updateModule: (id, moduleData) => {
        const now = new Date().toISOString();

        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === id
              ? { ...module, ...moduleData, updatedAt: now }
              : module,
          ),
        }));
      },

      deleteModule: (id) => {
        set((state) => ({
          modules: state.modules.filter((module) => module.id !== id),
        }));
      },

      updateModuleOrder: (courseId, moduleIds) => {
        const now = new Date().toISOString();

        set((state) => ({
          modules: state.modules.map((module) => {
            if (module.courseId !== courseId) return module;

            const newOrder = moduleIds.indexOf(module.id);
            if (newOrder === -1) return module;

            return {
              ...module,
              order: newOrder,
              updatedAt: now,
            };
          }),
        }));
      },

      addLectureToModule: (moduleId, lectureId) => {
        const now = new Date().toISOString();

        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? {
                  ...module,
                  lectures: [...module.lectures, lectureId],
                  lectureCount: module.lectureCount + 1,
                  updatedAt: now,
                }
              : module,
          ),
        }));
      },

      removeLectureFromModule: (moduleId, lectureId) => {
        const now = new Date().toISOString();

        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? {
                  ...module,
                  lectures: module.lectures.filter((id) => id !== lectureId),
                  lectureCount: Math.max(0, module.lectureCount - 1),
                  updatedAt: now,
                }
              : module,
          ),
        }));
      },

      updateLectureOrder: (moduleId, lectureIds) => {
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
      name: 'module-store', // localStorage key
    },
  ),
);

export default useModuleStore;
