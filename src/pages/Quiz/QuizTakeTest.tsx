import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore, type Quiz } from '../../store/useQuizStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FlagIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../../components/ui/use-toast';
import DefaultLayout from '../../layout/DefaultLayout';

interface QuizAttempt {
  id: string;
  quizId: number;
  userId: string;
  answers: Record<number, any>;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  timeLimit?: number;
  startedAt: string;
  completedAt?: string;
  status: 'in_progress' | 'completed' | 'submitted' | 'timeout';
  currentQuestionIndex: number;
  flaggedQuestions: number[];
}

const QuizTakeTest = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const { fetchQuizById } = useQuizStore();

  // Initialize quiz and attempt
  useEffect(() => {
    if (!quizId) return;

    const quizData = fetchQuizById(parseInt(quizId));
    if (!quizData) {
      toast({
        title: 'Quiz not found',
        variant: 'destructive',
      });
      navigate('/admin/quizzes');
      return;
    }

    setQuiz(quizData);

    // Check for existing attempt or create new one
    const existingAttempt = localStorage.getItem(`quiz_attempt_${quizId}`);
    if (existingAttempt) {
      const parsedAttempt = JSON.parse(existingAttempt);
      setAttempt(parsedAttempt);
      setCurrentQuestionIndex(parsedAttempt.currentQuestionIndex);

      if (parsedAttempt.timeLimit && parsedAttempt.status === 'in_progress') {
        const elapsed = Math.floor(
          (Date.now() - new Date(parsedAttempt.startedAt).getTime()) / 1000,
        );
        const remaining = parsedAttempt.timeLimit - elapsed;
        if (remaining > 0) {
          setTimeRemaining(remaining);
          setIsTimerRunning(true);
        } else {
          // Auto-submit if time is up
          handleAutoSubmit();
        }
      }
    } else {
      // Create new attempt
      const newAttempt: QuizAttempt = {
        id: Math.random().toString(36).substring(2),
        quizId: parseInt(quizId),
        userId: 'current_user', // Would get from auth context
        answers: {},
        score: 0,
        maxScore: quizData.questions.length,
        percentage: 0,
        timeSpent: 0,
        timeLimit: 30 * 60, // 30 minutes default
        startedAt: new Date().toISOString(),
        status: 'in_progress',
        currentQuestionIndex: 0,
        flaggedQuestions: [],
      };

      setAttempt(newAttempt);
      setTimeRemaining(newAttempt.timeLimit || null);
      setIsTimerRunning(true);

      // Save to localStorage
      localStorage.setItem(
        `quiz_attempt_${quizId}`,
        JSON.stringify(newAttempt),
      );
    }
  }, [quizId, fetchQuizById, navigate, toast]);

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || isPaused || timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setIsTimerRunning(false);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isPaused, timeRemaining]);

  const handleAutoSubmit = () => {
    if (!attempt) return;

    const finalAttempt = {
      ...attempt,
      status: 'timeout' as const,
      completedAt: new Date().toISOString(),
      timeSpent: attempt.timeLimit || 0,
    };

    setAttempt(finalAttempt);
    calculateScore(finalAttempt);

    toast({
      title: "Time's up!",
      description: 'Your quiz has been automatically submitted.',
      variant: 'destructive',
    });
  };

  const handleAnswerSelect = (questionId: number, answer: any) => {
    if (!attempt || attempt.status !== 'in_progress') return;

    const updatedAttempt = {
      ...attempt,
      answers: {
        ...attempt.answers,
        [questionId]: answer,
      },
    };

    setAttempt(updatedAttempt);
    localStorage.setItem(
      `quiz_attempt_${quizId}`,
      JSON.stringify(updatedAttempt),
    );
  };

  const handleQuestionNavigation = (direction: 'next' | 'prev') => {
    if (!quiz || !attempt) return;

    const newIndex =
      direction === 'next'
        ? Math.min(currentQuestionIndex + 1, quiz.questions.length - 1)
        : Math.max(currentQuestionIndex - 1, 0);

    setCurrentQuestionIndex(newIndex);

    const updatedAttempt = {
      ...attempt,
      currentQuestionIndex: newIndex,
    };

    setAttempt(updatedAttempt);
    localStorage.setItem(
      `quiz_attempt_${quizId}`,
      JSON.stringify(updatedAttempt),
    );
  };

  const handleFlagQuestion = () => {
    if (!attempt || !quiz) return;

    const questionId = quiz.questions[currentQuestionIndex].id;
    const flaggedQuestions = attempt.flaggedQuestions.includes(questionId)
      ? attempt.flaggedQuestions.filter((id) => id !== questionId)
      : [...attempt.flaggedQuestions, questionId];

    const updatedAttempt = {
      ...attempt,
      flaggedQuestions,
    };

    setAttempt(updatedAttempt);
    localStorage.setItem(
      `quiz_attempt_${quizId}`,
      JSON.stringify(updatedAttempt),
    );
  };

  const calculateScore = (finalAttempt: QuizAttempt) => {
    if (!quiz) return;

    let correctAnswers = 0;

    quiz.questions.forEach((question) => {
      const userAnswer = finalAttempt.answers[question.id];
      if (!userAnswer) return;

      switch (question.type) {
        case 'multiple_choice':
          const correctOption = question.options.find((opt) => opt.correct);
          if (correctOption && userAnswer === correctOption.id.toString()) {
            correctAnswers++;
          }
          break;
        case 'true_false':
          // Assuming the correct answer is stored in options[0].correct
          const correctBool = question.options[0]?.correct;
          if (userAnswer === correctBool?.toString()) {
            correctAnswers++;
          }
          break;
        // Add more question type scoring logic here
      }
    });

    const score = correctAnswers;
    const maxScore = quiz.questions.length;
    const percentage = (score / maxScore) * 100;

    const scoredAttempt = {
      ...finalAttempt,
      score,
      maxScore,
      percentage,
    };

    setAttempt(scoredAttempt);
    localStorage.setItem(
      `quiz_attempt_${quizId}`,
      JSON.stringify(scoredAttempt),
    );

    // Navigate to results
    navigate(`/admin/quiz/${quizId}/results/${scoredAttempt.id}`);
  };

  const handleSubmitQuiz = () => {
    if (!attempt) return;

    const finalAttempt = {
      ...attempt,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
      timeSpent: attempt.timeLimit
        ? attempt.timeLimit - (timeRemaining || 0)
        : 0,
    };

    setIsTimerRunning(false);
    calculateScore(finalAttempt);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    setIsTimerRunning(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!quiz || !attempt) return 0;
    const answeredQuestions = Object.keys(attempt.answers).length;
    return (answeredQuestions / quiz.questions.length) * 100;
  };

  if (!quiz || !attempt) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isCurrentQuestionFlagged = attempt.flaggedQuestions.includes(
    currentQuestion.id,
  );
  const hasAnswer = attempt.answers[currentQuestion.id] !== undefined;

  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {quiz.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {quiz.description}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/quizzes')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Exit Quiz
          </Button>
        </div>

        {/* Timer and Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {timeRemaining !== null && (
                  <div
                    className={`flex items-center space-x-2 ${
                      timeRemaining < 300 ? 'text-red-600' : ''
                    }`}
                  >
                    <ClockIcon className="w-5 h-5" />
                    <span className="font-mono text-lg">
                      {formatTime(timeRemaining)}
                    </span>
                    {timeRemaining < 300 && (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePause}
                  className="flex items-center"
                >
                  {isPaused ? (
                    <>
                      <PlayIcon className="w-4 h-4 mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <PauseIcon className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {hasAnswer && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Answered
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlagQuestion}
                  className={
                    isCurrentQuestionFlagged
                      ? 'bg-yellow-50 text-yellow-700'
                      : ''
                  }
                >
                  <FlagIcon className="w-4 h-4 mr-1" />
                  {isCurrentQuestionFlagged ? 'Unflag' : 'Flag'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg text-gray-900 dark:text-white">
                {currentQuestion.question}
              </p>

              {/* Render different question types */}
              {currentQuestion.type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value={option.id}
                        checked={
                          attempt.answers[currentQuestion.id] ===
                          option.id.toString()
                        }
                        onChange={(e) =>
                          handleAnswerSelect(currentQuestion.id, e.target.value)
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-gray-900 dark:text-white">
                        {option.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'true_false' && (
                <div className="space-y-3">
                  {['true', 'false'].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value={option}
                        checked={attempt.answers[currentQuestion.id] === option}
                        onChange={(e) =>
                          handleAnswerSelect(currentQuestion.id, e.target.value)
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-gray-900 dark:text-white capitalize">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => handleQuestionNavigation('prev')}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitConfirm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={() => handleQuestionNavigation('next')}>
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Submit Quiz?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to submit your quiz? You won't be able
                  to make changes after submission.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Answered: {Object.keys(attempt.answers).length} of{' '}
                  {quiz.questions.length} questions
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitQuiz}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default QuizTakeTest;
