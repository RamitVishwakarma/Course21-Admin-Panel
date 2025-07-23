import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore, type Quiz } from '../../store/useQuizStore';
import { useUserStore } from '../../store/useUserStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import DefaultLayout from '../../layout/DefaultLayout';

interface QuizAttempt {
  id: string;
  quizId: number;
  userId: string;
  answers: Record<number, any>; // questionId -> answer
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number; // in seconds
  startedAt: string;
  completedAt: string;
  passed: boolean;
}

interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  averageTimeSpent: number;
  questionAnalytics: {
    questionId: number;
    question: string;
    correctAnswers: number;
    totalAnswers: number;
    accuracy: number;
  }[];
  topPerformers: {
    userId: string;
    userName: string;
    score: number;
    percentage: number;
    timeSpent: number;
  }[];
}

export default function QuizResults() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { fetchQuizById } = useQuizStore();
  const { users } = useUserStore();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      loadQuizData();
    }
  }, [quizId]);

  const loadQuizData = () => {
    setIsLoading(true);

    // Fetch quiz data
    const quizData = fetchQuizById(parseInt(quizId!));
    setQuiz(quizData || null);

    // Generate sample quiz attempts for demonstration
    const sampleAttempts = generateSampleAttempts(quizData);
    setAttempts(sampleAttempts);

    // Calculate analytics
    const analyticsData = calculateAnalytics(quizData, sampleAttempts);
    setAnalytics(analyticsData);

    setIsLoading(false);
  };

  const generateSampleAttempts = (quizData: any): QuizAttempt[] => {
    if (!quizData) return [];

    const sampleAttempts: QuizAttempt[] = [];
    const maxScore = quizData.questions.length;

    // Generate 15-25 sample attempts
    const attemptCount = Math.floor(Math.random() * 10) + 15;

    for (let i = 0; i < attemptCount; i++) {
      const score = Math.floor(Math.random() * maxScore) + 1;
      const percentage = (score / maxScore) * 100;
      const timeSpent = Math.floor(Math.random() * 1200) + 300; // 5-25 minutes
      const userId =
        users[Math.floor(Math.random() * users.length)]?.id || 'user-1';

      const answers: Record<number, any> = {};
      quizData.questions.forEach((question: any, index: number) => {
        // Simulate answers with realistic correctness based on score
        const shouldBeCorrect = Math.random() < score / maxScore;
        if (question.type === 'multiple_choice') {
          const correctOption = question.options.find(
            (opt: any) => opt.correct,
          );
          const randomOption =
            question.options[
              Math.floor(Math.random() * question.options.length)
            ];
          answers[question.id] = shouldBeCorrect
            ? correctOption?.id
            : randomOption?.id;
        }
      });

      sampleAttempts.push({
        id: `attempt-${i + 1}`,
        quizId: quizData.id,
        userId,
        answers,
        score,
        maxScore,
        percentage,
        timeSpent,
        startedAt: new Date(
          Date.now() - timeSpent * 1000 - Math.random() * 86400000 * 7,
        ).toISOString(),
        completedAt: new Date(
          Date.now() - Math.random() * 86400000 * 7,
        ).toISOString(),
        passed: percentage >= 70,
      });
    }

    return sampleAttempts.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  };

  const calculateAnalytics = (
    quizData: any,
    attempts: QuizAttempt[],
  ): QuizAnalytics => {
    if (!quizData || attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        passRate: 0,
        averageTimeSpent: 0,
        questionAnalytics: [],
        topPerformers: [],
      };
    }

    const totalAttempts = attempts.length;
    const averageScore =
      attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
      totalAttempts;
    const passRate =
      (attempts.filter((attempt) => attempt.passed).length / totalAttempts) *
      100;
    const averageTimeSpent =
      attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) /
      totalAttempts;

    // Question analytics
    const questionAnalytics = quizData.questions.map((question: any) => {
      const questionAttempts = attempts.length;
      const correctAnswers = attempts.filter((attempt) => {
        const userAnswer = attempt.answers[question.id];
        const correctOption = question.options.find((opt: any) => opt.correct);
        return userAnswer === correctOption?.id;
      }).length;

      return {
        questionId: question.id,
        question: question.question,
        correctAnswers,
        totalAnswers: questionAttempts,
        accuracy:
          questionAttempts > 0 ? (correctAnswers / questionAttempts) * 100 : 0,
      };
    });

    // Top performers
    const topPerformers = attempts
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
      .map((attempt) => {
        const user = users.find((u) => u.id === attempt.userId);
        return {
          userId: attempt.userId,
          userName: user
            ? `${user.firstName} ${user.lastName}`
            : 'Unknown User',
          score: attempt.score,
          percentage: attempt.percentage,
          timeSpent: attempt.timeSpent,
        };
      });

    return {
      totalAttempts,
      averageScore,
      passRate,
      averageTimeSpent,
      questionAnalytics,
      topPerformers,
    };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (!quiz) {
    return (
      <DefaultLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Quiz not found
          </h3>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quiz Results: {quiz.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {quiz.description}
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Attempts
                    </p>
                    <p className="text-xl font-bold">
                      {analytics.totalAttempts}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <ChartBarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Average Score
                    </p>
                    <p className="text-xl font-bold">
                      {Math.round(analytics.averageScore)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <TrophyIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pass Rate
                    </p>
                    <p className="text-xl font-bold">
                      {Math.round(analytics.passRate)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Avg. Time
                    </p>
                    <p className="text-xl font-bold">
                      {formatTime(Math.round(analytics.averageTimeSpent))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Analytics */}
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5" />
                  Question Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.questionAnalytics.map((qa, index) => (
                    <div
                      key={qa.questionId}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium">
                          Q{index + 1}: {qa.question.substring(0, 60)}...
                        </p>
                        <Badge
                          variant={
                            qa.accuracy >= 70 ? 'default' : 'destructive'
                          }
                        >
                          {Math.round(qa.accuracy)}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <CheckCircleIcon className="h-3 w-3 text-green-500" />
                          {qa.correctAnswers} correct
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircleIcon className="h-3 w-3 text-red-500" />
                          {qa.totalAnswers - qa.correctAnswers} incorrect
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            qa.accuracy >= 70 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${qa.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Performers */}
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrophyIcon className="h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPerformers.map((performer, index) => (
                    <div
                      key={performer.userId}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0
                              ? 'bg-yellow-500 text-white'
                              : index === 1
                              ? 'bg-gray-400 text-white'
                              : index === 2
                              ? 'bg-orange-600 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{performer.userName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(performer.timeSpent)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {Math.round(performer.percentage)}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {performer.score}/{quiz.questions.length}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Student</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Time Spent</th>
                    <th className="text-left py-2">Completed</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 10).map((attempt) => {
                    const user = users.find((u) => u.id === attempt.userId);
                    return (
                      <tr key={attempt.id} className="border-b">
                        <td className="py-3">
                          {user
                            ? `${user.firstName} ${user.lastName}`
                            : 'Unknown User'}
                        </td>
                        <td className="py-3">
                          <span className="font-medium">
                            {attempt.score}/{attempt.maxScore}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                            ({Math.round(attempt.percentage)}%)
                          </span>
                        </td>
                        <td className="py-3">
                          {formatTime(attempt.timeSpent)}
                        </td>
                        <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(attempt.completedAt)}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={attempt.passed ? 'default' : 'destructive'}
                          >
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}
