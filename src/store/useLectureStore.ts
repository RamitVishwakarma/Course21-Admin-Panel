import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleLectures } from '../data/sample/lectures';
import { type Lecture } from '../types';

// Video progress tracking interfaces
export interface VideoProgress {
  lectureId: string;
  userId: string;
  currentTime: number; // in seconds
  totalDuration: number; // in seconds
  completed: boolean;
  completedAt?: string;
  watchedSegments: WatchedSegment[];
  lastWatchedAt: string;
}

export interface WatchedSegment {
  startTime: number;
  endTime: number;
}

export interface LectureCompletion {
  lectureId: string;
  userId: string;
  completed: boolean;
  completedAt?: string;
  progressPercentage: number;
  timeSpent: number; // total time spent watching in seconds
}

export interface LectureNote {
  id: string;
  lectureId: string;
  userId: string;
  timestamp: number; // video timestamp in seconds
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LectureBookmark {
  id: string;
  lectureId: string;
  userId: string;
  timestamp: number; // video timestamp in seconds
  title: string;
  createdAt: string;
}

interface LectureStore {
  lectures: Lecture[];
  videoProgress: VideoProgress[];
  lectureCompletions: LectureCompletion[];
  lectureNotes: LectureNote[];
  lectureBookmarks: LectureBookmark[];
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchLectures: () => Promise<void>;
  fetchLectureById: (id: string) => Lecture | undefined;
  fetchLecturesByModuleId: (moduleId: string) => Lecture[];
  fetchLecturesByCourseId: (courseId: string) => Lecture[];

  // CRUD operations
  addLecture: (
    lectureData: Omit<Lecture, 'id' | 'createdAt' | 'updatedAt'>,
  ) => string;
  updateLecture: (id: string, lectureData: Partial<Lecture>) => void;
  deleteLecture: (id: string) => void;
  updateLectureOrder: (moduleId: string, lectureIds: string[]) => void;

  // Video Progress operations
  updateVideoProgress: (
    lectureId: string,
    userId: string,
    currentTime: number,
    totalDuration: number,
  ) => void;
  getVideoProgress: (
    lectureId: string,
    userId: string,
  ) => VideoProgress | undefined;
  markLectureComplete: (lectureId: string, userId: string) => void;
  markLectureIncomplete: (lectureId: string, userId: string) => void;
  getLectureCompletion: (
    lectureId: string,
    userId: string,
  ) => LectureCompletion | undefined;

  // Notes operations
  addLectureNote: (
    lectureId: string,
    userId: string,
    timestamp: number,
    content: string,
  ) => string;
  updateLectureNote: (noteId: string, content: string) => void;
  deleteLectureNote: (noteId: string) => void;
  getLectureNotes: (lectureId: string, userId: string) => LectureNote[];

  // Bookmarks operations
  addLectureBookmark: (
    lectureId: string,
    userId: string,
    timestamp: number,
    title: string,
  ) => string;
  deleteLectureBookmark: (bookmarkId: string) => void;
  getLectureBookmarks: (lectureId: string, userId: string) => LectureBookmark[];

  // Analytics helpers
  calculateWatchedPercentage: (lectureId: string, userId: string) => number;
  getCompletionRate: (moduleId: string) => number;
  getCourseProgress: (courseId: string, userId: string) => number;

  // Batch operations
  deleteLecturesByModuleId: (moduleId: string) => void;
  deleteLecturesByCourseId: (courseId: string) => void;
}

export const useLectureStore = create<LectureStore>()(
  persist(
    (set, get) => ({
      lectures: [],
      videoProgress: [],
      lectureCompletions: [],
      lectureNotes: [],
      lectureBookmarks: [],
      isLoading: false,
      error: null,

      fetchLectures: async () => {
        const currentLectures = get().lectures;
        if (currentLectures.length === 0) {
          // First load: populate from sample data
          set({ lectures: sampleLectures, isLoading: false });
        }
        // Subsequent calls do nothing - data already in localStorage
      },

      fetchLectureById: (id) => {
        return get().lectures.find((lecture) => lecture.id === id);
      },

      fetchLecturesByModuleId: (moduleId) => {
        return get()
          .lectures.filter((lecture) => lecture.moduleId === moduleId)
          .sort((a, b) => a.order - b.order);
      },

      fetchLecturesByCourseId: (courseId) => {
        return get().lectures.filter(
          (lecture) => lecture.courseId === courseId,
        );
      },

      addLecture: (lectureData) => {
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
          viewCount: 0,
          completionRate: 0,
          averageWatchTime: 0,
          dropOffPoints: [],
        };

        set((state) => ({
          lectures: [...state.lectures, newLecture],
        }));

        return newId;
      },

      updateLecture: (id, lectureData) => {
        const now = new Date().toISOString();

        set((state) => ({
          lectures: state.lectures.map((lecture) =>
            lecture.id === id
              ? { ...lecture, ...lectureData, updatedAt: now }
              : lecture,
          ),
        }));
      },

      deleteLecture: (id) => {
        set((state) => ({
          lectures: state.lectures.filter((lecture) => lecture.id !== id),
          // Also cleanup related data
          videoProgress: state.videoProgress.filter((p) => p.lectureId !== id),
          lectureCompletions: state.lectureCompletions.filter(
            (c) => c.lectureId !== id,
          ),
          lectureNotes: state.lectureNotes.filter((n) => n.lectureId !== id),
          lectureBookmarks: state.lectureBookmarks.filter(
            (b) => b.lectureId !== id,
          ),
        }));
      },

      updateLectureOrder: (moduleId, lectureIds) => {
        const now = new Date().toISOString();

        set((state) => ({
          lectures: state.lectures.map((lecture) => {
            if (lecture.moduleId !== moduleId) return lecture;

            const newOrder = lectureIds.indexOf(lecture.id);
            if (newOrder === -1) return lecture;

            return {
              ...lecture,
              order: newOrder,
              updatedAt: now,
            };
          }),
        }));
      },

      // Video Progress operations
      updateVideoProgress: (lectureId, userId, currentTime, totalDuration) => {
        const now = new Date().toISOString();
        const progressPercentage = (currentTime / totalDuration) * 100;
        const isCompleted = progressPercentage >= 90; // Consider 90% as completed

        set((state) => {
          const existingProgress = state.videoProgress.find(
            (p) => p.lectureId === lectureId && p.userId === userId,
          );

          let updatedProgress: VideoProgress[];

          if (existingProgress) {
            updatedProgress = state.videoProgress.map((p) =>
              p.lectureId === lectureId && p.userId === userId
                ? {
                    ...p,
                    currentTime,
                    totalDuration,
                    completed: isCompleted,
                    completedAt: isCompleted ? now : p.completedAt,
                    lastWatchedAt: now,
                  }
                : p,
            );
          } else {
            const newProgress: VideoProgress = {
              lectureId,
              userId,
              currentTime,
              totalDuration,
              completed: isCompleted,
              completedAt: isCompleted ? now : undefined,
              watchedSegments: [],
              lastWatchedAt: now,
            };
            updatedProgress = [...state.videoProgress, newProgress];
          }

          // Update lecture completion as well
          let updatedCompletions = state.lectureCompletions;
          const existingCompletion = state.lectureCompletions.find(
            (c) => c.lectureId === lectureId && c.userId === userId,
          );

          if (existingCompletion) {
            updatedCompletions = state.lectureCompletions.map((c) =>
              c.lectureId === lectureId && c.userId === userId
                ? {
                    ...c,
                    completed: isCompleted,
                    completedAt: isCompleted ? now : undefined,
                    progressPercentage,
                  }
                : c,
            );
          } else {
            const newCompletion: LectureCompletion = {
              lectureId,
              userId,
              completed: isCompleted,
              completedAt: isCompleted ? now : undefined,
              progressPercentage,
              timeSpent: currentTime,
            };
            updatedCompletions = [...state.lectureCompletions, newCompletion];
          }

          return {
            videoProgress: updatedProgress,
            lectureCompletions: updatedCompletions,
          };
        });
      },

      getVideoProgress: (lectureId, userId) => {
        return get().videoProgress.find(
          (p) => p.lectureId === lectureId && p.userId === userId,
        );
      },

      markLectureComplete: (lectureId, userId) => {
        const now = new Date().toISOString();

        set((state) => {
          const existingCompletion = state.lectureCompletions.find(
            (c) => c.lectureId === lectureId && c.userId === userId,
          );

          let updatedCompletions: LectureCompletion[];

          if (existingCompletion) {
            updatedCompletions = state.lectureCompletions.map((c) =>
              c.lectureId === lectureId && c.userId === userId
                ? {
                    ...c,
                    completed: true,
                    completedAt: now,
                    progressPercentage: 100,
                  }
                : c,
            );
          } else {
            const newCompletion: LectureCompletion = {
              lectureId,
              userId,
              completed: true,
              completedAt: now,
              progressPercentage: 100,
              timeSpent: 0,
            };
            updatedCompletions = [...state.lectureCompletions, newCompletion];
          }

          return { lectureCompletions: updatedCompletions };
        });
      },

      markLectureIncomplete: (lectureId, userId) => {
        set((state) => ({
          lectureCompletions: state.lectureCompletions.map((c) =>
            c.lectureId === lectureId && c.userId === userId
              ? { ...c, completed: false, completedAt: undefined }
              : c,
          ),
        }));
      },

      getLectureCompletion: (lectureId, userId) => {
        return get().lectureCompletions.find(
          (c) => c.lectureId === lectureId && c.userId === userId,
        );
      },

      // Notes operations
      addLectureNote: (lectureId, userId, timestamp, content) => {
        const notes = get().lectureNotes;
        const newId = (notes.length + 1).toString();
        const now = new Date().toISOString();

        const newNote: LectureNote = {
          id: newId,
          lectureId,
          userId,
          timestamp,
          content,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          lectureNotes: [...state.lectureNotes, newNote],
        }));

        return newId;
      },

      updateLectureNote: (noteId, content) => {
        const now = new Date().toISOString();

        set((state) => ({
          lectureNotes: state.lectureNotes.map((note) =>
            note.id === noteId ? { ...note, content, updatedAt: now } : note,
          ),
        }));
      },

      deleteLectureNote: (noteId) => {
        set((state) => ({
          lectureNotes: state.lectureNotes.filter((note) => note.id !== noteId),
        }));
      },

      getLectureNotes: (lectureId, userId) => {
        return get()
          .lectureNotes.filter(
            (note) => note.lectureId === lectureId && note.userId === userId,
          )
          .sort((a, b) => a.timestamp - b.timestamp);
      },

      // Bookmarks operations
      addLectureBookmark: (lectureId, userId, timestamp, title) => {
        const bookmarks = get().lectureBookmarks;
        const newId = (bookmarks.length + 1).toString();
        const now = new Date().toISOString();

        const newBookmark: LectureBookmark = {
          id: newId,
          lectureId,
          userId,
          timestamp,
          title,
          createdAt: now,
        };

        set((state) => ({
          lectureBookmarks: [...state.lectureBookmarks, newBookmark],
        }));

        return newId;
      },

      deleteLectureBookmark: (bookmarkId) => {
        set((state) => ({
          lectureBookmarks: state.lectureBookmarks.filter(
            (bookmark) => bookmark.id !== bookmarkId,
          ),
        }));
      },

      getLectureBookmarks: (lectureId, userId) => {
        return get()
          .lectureBookmarks.filter(
            (bookmark) =>
              bookmark.lectureId === lectureId && bookmark.userId === userId,
          )
          .sort((a, b) => a.timestamp - b.timestamp);
      },

      // Analytics helpers
      calculateWatchedPercentage: (lectureId, userId) => {
        const progress = get().getVideoProgress(lectureId, userId);
        if (!progress || progress.totalDuration === 0) return 0;
        return (progress.currentTime / progress.totalDuration) * 100;
      },

      getCompletionRate: (moduleId) => {
        const lectures = get().fetchLecturesByModuleId(moduleId);
        const completions = get().lectureCompletions;

        if (lectures.length === 0) return 0;

        const completedLectures = lectures.filter((lecture) =>
          completions.some((c) => c.lectureId === lecture.id && c.completed),
        );

        return (completedLectures.length / lectures.length) * 100;
      },

      getCourseProgress: (courseId, userId) => {
        const lectures = get().fetchLecturesByCourseId(courseId);
        const completions = get().lectureCompletions;

        if (lectures.length === 0) return 0;

        const userCompletions = completions.filter(
          (c) => c.userId === userId && c.completed,
        );
        const completedCourseLectures = lectures.filter((lecture) =>
          userCompletions.some((c) => c.lectureId === lecture.id),
        );

        return (completedCourseLectures.length / lectures.length) * 100;
      },

      deleteLecturesByModuleId: (moduleId) => {
        set((state) => {
          const lectureIds = state.lectures
            .filter((lecture) => lecture.moduleId === moduleId)
            .map((lecture) => lecture.id);

          return {
            lectures: state.lectures.filter(
              (lecture) => lecture.moduleId !== moduleId,
            ),
            videoProgress: state.videoProgress.filter(
              (p) => !lectureIds.includes(p.lectureId),
            ),
            lectureCompletions: state.lectureCompletions.filter(
              (c) => !lectureIds.includes(c.lectureId),
            ),
            lectureNotes: state.lectureNotes.filter(
              (n) => !lectureIds.includes(n.lectureId),
            ),
            lectureBookmarks: state.lectureBookmarks.filter(
              (b) => !lectureIds.includes(b.lectureId),
            ),
          };
        });
      },

      deleteLecturesByCourseId: (courseId) => {
        set((state) => {
          const lectureIds = state.lectures
            .filter((lecture) => lecture.courseId === courseId)
            .map((lecture) => lecture.id);

          return {
            lectures: state.lectures.filter(
              (lecture) => lecture.courseId !== courseId,
            ),
            videoProgress: state.videoProgress.filter(
              (p) => !lectureIds.includes(p.lectureId),
            ),
            lectureCompletions: state.lectureCompletions.filter(
              (c) => !lectureIds.includes(c.lectureId),
            ),
            lectureNotes: state.lectureNotes.filter(
              (n) => !lectureIds.includes(n.lectureId),
            ),
            lectureBookmarks: state.lectureBookmarks.filter(
              (b) => !lectureIds.includes(b.lectureId),
            ),
          };
        });
      },
    }),
    {
      name: 'lecture-store', // localStorage key
    },
  ),
);

export default useLectureStore;
