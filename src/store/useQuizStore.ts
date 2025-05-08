import { create } from 'zustand';

// Sample quiz data
const QuizData = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals',
    module_id: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    questions: [
      {
        id: 1,
        quiz_id: 1,
        question: 'What is JavaScript?',
        type: 'multiple_choice',
        options: [
          { id: 1, text: 'A programming language', correct: true },
          { id: 2, text: 'A type of coffee', correct: false },
          { id: 3, text: 'A markup language', correct: false },
          { id: 4, text: 'A database system', correct: false },
        ],
      },
      {
        id: 2,
        quiz_id: 1,
        question: 'Which of the following is not a JavaScript data type?',
        type: 'multiple_choice',
        options: [
          { id: 5, text: 'String', correct: false },
          { id: 6, text: 'Boolean', correct: false },
          { id: 7, text: 'Integer', correct: true },
          { id: 8, text: 'Object', correct: false },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'React Fundamentals',
    description: 'Test your knowledge of React basics',
    module_id: 2,
    created_at: '2023-02-01T00:00:00.000Z',
    updated_at: '2023-02-01T00:00:00.000Z',
    questions: [
      {
        id: 3,
        quiz_id: 2,
        question: 'What is JSX?',
        type: 'multiple_choice',
        options: [
          { id: 9, text: 'JavaScript XML', correct: true },
          { id: 10, text: 'JavaScript Extension', correct: false },
          { id: 11, text: 'Java Syntax', correct: false },
          { id: 12, text: 'JavaScript XSL', correct: false },
        ],
      },
    ],
  },
];

export interface QuizOption {
  id: number;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  type: string;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  module_id: number;
  created_at: string;
  updated_at: string;
  questions: QuizQuestion[];
}

interface QuizStore {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchQuizzes: () => void;
  fetchQuizzesByModuleId: (moduleId: number) => Quiz[];
  fetchQuizById: (id: number) => Quiz | undefined;

  // CRUD operations
  addQuiz: (quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) => void;
  updateQuiz: (id: number, quizData: Partial<Quiz>) => void;
  deleteQuiz: (id: number) => void;

  // Question operations
  addQuestion: (quizId: number, question: Omit<QuizQuestion, 'id'>) => void;
  updateQuestion: (id: number, questionData: Partial<QuizQuestion>) => void;
  deleteQuestion: (id: number) => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: [],
  isLoading: false,
  error: null,

  fetchQuizzes: () => {
    set({ isLoading: true, error: null });
    try {
      // Instead of API call, use dummy data
      set({ quizzes: QuizData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch quizzes', isLoading: false });
    }
  },

  fetchQuizzesByModuleId: (moduleId) => {
    return get().quizzes.filter((quiz) => quiz.module_id === moduleId);
  },

  fetchQuizById: (id) => {
    return get().quizzes.find((quiz) => quiz.id === id);
  },

  addQuiz: (quizData) => {
    const newId = Math.max(0, ...get().quizzes.map((quiz) => quiz.id)) + 1;
    const now = new Date().toISOString();

    const newQuiz: Quiz = {
      id: newId,
      ...quizData,
      created_at: now,
      updated_at: now,
    };

    set((state) => ({
      quizzes: [...state.quizzes, newQuiz],
    }));

    return newQuiz;
  },

  updateQuiz: (id, quizData) => {
    set((state) => ({
      quizzes: state.quizzes.map((quiz) =>
        quiz.id === id
          ? { ...quiz, ...quizData, updated_at: new Date().toISOString() }
          : quiz,
      ),
    }));
  },

  deleteQuiz: (id) => {
    set((state) => ({
      quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
    }));
  },

  addQuestion: (quizId, questionData) => {
    const quizzes = get().quizzes;
    const quiz = quizzes.find((q) => q.id === quizId);

    if (!quiz) return;

    const newId =
      Math.max(
        0,
        ...quizzes.flatMap((quiz) =>
          quiz.questions.map((question) => question.id),
        ),
      ) + 1;

    const newQuestion: QuizQuestion = {
      id: newId,
      ...questionData,
    };

    set((state) => ({
      quizzes: state.quizzes.map((quiz) =>
        quiz.id === quizId
          ? {
              ...quiz,
              questions: [...quiz.questions, newQuestion],
              updated_at: new Date().toISOString(),
            }
          : quiz,
      ),
    }));

    return newQuestion;
  },

  updateQuestion: (id, questionData) => {
    set((state) => ({
      quizzes: state.quizzes.map((quiz) => {
        const questionIndex = quiz.questions.findIndex(
          (question) => question.id === id,
        );

        if (questionIndex === -1) return quiz;

        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          ...questionData,
        };

        return {
          ...quiz,
          questions: updatedQuestions,
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  },

  deleteQuestion: (id) => {
    set((state) => ({
      quizzes: state.quizzes.map((quiz) => {
        const hasQuestion = quiz.questions.some(
          (question) => question.id === id,
        );

        if (!hasQuestion) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.filter((question) => question.id !== id),
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  },
}));
