import { create } from 'zustand';

// Sample lecture data
const LectureData = [
  {
    id: 1,
    title: 'Introduction to JavaScript',
    description: 'Learn the basics of JavaScript programming',
    module_id: 1,
    sequence: 1,
    url: 'https://example.com/videos/javascript-intro',
    resource_url: 'https://example.com/resources/javascript-intro.pdf',
    created_at: '2023-01-15T08:30:00.000Z',
    updated_at: '2023-01-15T08:30:00.000Z',
  },
  {
    id: 2,
    title: 'JavaScript Variables and Data Types',
    description: 'Understanding variables and data types in JavaScript',
    module_id: 1,
    sequence: 2,
    url: 'https://example.com/videos/javascript-variables',
    resource_url: 'https://example.com/resources/javascript-variables.pdf',
    created_at: '2023-01-16T09:15:00.000Z',
    updated_at: '2023-01-16T09:15:00.000Z',
  },
  {
    id: 3,
    title: 'JavaScript Functions',
    description: 'Working with functions in JavaScript',
    module_id: 1,
    sequence: 3,
    url: 'https://example.com/videos/javascript-functions',
    resource_url: 'https://example.com/resources/javascript-functions.pdf',
    created_at: '2023-01-17T10:00:00.000Z',
    updated_at: '2023-01-17T10:00:00.000Z',
  },
  {
    id: 4,
    title: 'Introduction to React',
    description: 'Getting started with React.js',
    module_id: 2,
    sequence: 1,
    url: 'https://example.com/videos/react-intro',
    resource_url: 'https://example.com/resources/react-intro.pdf',
    created_at: '2023-02-10T11:30:00.000Z',
    updated_at: '2023-02-10T11:30:00.000Z',
  },
  {
    id: 5,
    title: 'React Components',
    description: 'Building components in React',
    module_id: 2,
    sequence: 2,
    url: 'https://example.com/videos/react-components',
    resource_url: 'https://example.com/resources/react-components.pdf',
    created_at: '2023-02-11T13:45:00.000Z',
    updated_at: '2023-02-11T13:45:00.000Z',
  },
];

export interface Lecture {
  id: number;
  title: string;
  description: string;
  module_id: number;
  sequence: number;
  url: string;
  resource_url: string | null;
  created_at: string;
  updated_at: string;
}

interface LectureStore {
  lectures: Lecture[];
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchLectures: () => void;
  fetchLecturesByModuleId: (moduleId: number) => Lecture[];
  fetchLectureById: (id: number) => Lecture | undefined;

  // CRUD operations
  addLecture: (
    lecture: Omit<Lecture, 'id' | 'created_at' | 'updated_at'>,
  ) => Lecture;
  updateLecture: (id: number, lectureData: Partial<Lecture>) => void;
  deleteLecture: (id: number) => void;
  updateLectureSequence: (
    moduleId: number,
    lectureSequences: { id: number; sequence: number }[],
  ) => void;
}

export const useLectureStore = create<LectureStore>((set, get) => ({
  lectures: [],
  isLoading: false,
  error: null,

  fetchLectures: () => {
    set({ isLoading: true, error: null });
    try {
      // Instead of API call, use dummy data
      set({ lectures: LectureData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch lectures', isLoading: false });
    }
  },

  fetchLecturesByModuleId: (moduleId) => {
    return get()
      .lectures.filter((lecture) => lecture.module_id === moduleId)
      .sort((a, b) => a.sequence - b.sequence);
  },

  fetchLectureById: (id) => {
    return get().lectures.find((lecture) => lecture.id === id);
  },

  addLecture: (lectureData) => {
    const newId =
      Math.max(0, ...get().lectures.map((lecture) => lecture.id)) + 1;
    const now = new Date().toISOString();

    const newLecture: Lecture = {
      id: newId,
      ...lectureData,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      lectures: [...state.lectures, newLecture],
    }));

    return newLecture;
  },

  updateLecture: (id, lectureData) => {
    set((state) => ({
      lectures: state.lectures.map((lecture) =>
        lecture.id === id
          ? { ...lecture, ...lectureData, updated_at: new Date().toISOString() }
          : lecture,
      ),
    }));
  },

  deleteLecture: (id) => {
    set((state) => ({
      lectures: state.lectures.filter((lecture) => lecture.id !== id),
    }));
  },

  updateLectureSequence: (moduleId, lectureSequences) => {
    set((state) => ({
      lectures: state.lectures.map((lecture) => {
        if (lecture.module_id !== moduleId) return lecture;

        const sequenceUpdate = lectureSequences.find(
          (seq) => seq.id === lecture.id,
        );
        if (!sequenceUpdate) return lecture;

        return {
          ...lecture,
          sequence: sequenceUpdate.sequence,
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  },
}));
