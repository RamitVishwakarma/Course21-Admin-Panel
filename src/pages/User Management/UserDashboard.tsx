import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { useCourseStore } from '../../store/useCourseStore';
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
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import DefaultLayout from '../../layout/DefaultLayout';

interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessed: string;
  progress: number; // 0-100
  completedModules: string[];
  completedLectures: string[];
  totalTimeSpent: number; // in minutes
  status: 'active' | 'completed' | 'paused';
  certificateIssued?: boolean;
}

interface UserProgress {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLearningTime: number; // in hours
  certificatesEarned: number;
  averageProgress: number;
  lastActivity: string;
  skillLevel: string;
  achievements: string[];
  quizScores: {
    average: number;
    total: number;
    passed: number;
  };
}

const UserDashboard = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);

  const { users, fetchUsers } = useUserStore();
  const { courses, fetchCourses } = useCourseStore();

  const user = users.find((u) => u.id === userId);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      if (users.length === 0) await fetchUsers();
      if (courses.length === 0) await fetchCourses();

      // Generate mock user progress data
      const mockEnrollments: UserEnrollment[] = [
        {
          id: '1',
          userId: userId!,
          courseId: '1',
          enrolledAt: '2024-01-15T09:00:00Z',
          lastAccessed: '2024-01-20T14:30:00Z',
          progress: 75,
          completedModules: ['1', '2'],
          completedLectures: ['1', '2', '3', '4', '5', '6'],
          totalTimeSpent: 420, // 7 hours
          status: 'active',
        },
        {
          id: '2',
          userId: userId!,
          courseId: '2',
          enrolledAt: '2024-01-10T10:00:00Z',
          lastAccessed: '2024-01-18T16:45:00Z',
          progress: 100,
          completedModules: ['3', '4', '5'],
          completedLectures: ['7', '8', '9', '10', '11', '12', '13', '14'],
          totalTimeSpent: 580, // 9.67 hours
          status: 'completed',
          certificateIssued: true,
        },
        {
          id: '3',
          userId: userId!,
          courseId: '3',
          enrolledAt: '2024-01-05T11:30:00Z',
          lastAccessed: '2024-01-12T12:15:00Z',
          progress: 45,
          completedModules: ['6'],
          completedLectures: ['15', '16', '17', '18'],
          totalTimeSpent: 290, // 4.83 hours
          status: 'active',
        },
      ];

      const mockProgress: UserProgress = {
        totalCourses: 3,
        completedCourses: 1,
        inProgressCourses: 2,
        totalLearningTime: 21.5, // hours
        certificatesEarned: 1,
        averageProgress: 73.3,
        lastActivity: '2024-01-20T14:30:00Z',
        skillLevel: 'Intermediate',
        achievements: [
          'First Course Completed',
          'Quick Learner',
          'Quiz Master',
          'Consistent Learner',
        ],
        quizScores: {
          average: 87.5,
          total: 8,
          passed: 7,
        },
      };

      setEnrollments(mockEnrollments);
      setUserProgress(mockProgress);
      setLoading(false);
    };

    if (userId) {
      loadUserData();
    }
  }, [userId, users, courses, fetchUsers, fetchCourses]);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-gray-100 text-gray-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-green-100 text-green-800';
      case 'Expert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (!user || !userProgress) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h2>
          <Button onClick={() => navigate('/admin/manage-user')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/manage-user')}
              className="flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.name || user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getSkillLevelColor(userProgress.skillLevel)}>
              {userProgress.skillLevel}
            </Badge>
            <Badge variant="outline">
              <TrophyIcon className="w-3 h-3 mr-1" />
              {userProgress.certificatesEarned} Certificates
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                {userProgress.completedCourses} completed,{' '}
                {userProgress.inProgressCourses} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Learning Time
              </CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.totalLearningTime}h
              </div>
              <p className="text-xs text-muted-foreground">
                Average progress: {userProgress.averageProgress.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quiz Performance
              </CardTitle>
              <AcademicCapIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.quizScores.average}%
              </div>
              <p className="text-xs text-muted-foreground">
                {userProgress.quizScores.passed}/{userProgress.quizScores.total}{' '}
                quizzes passed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Activity
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {formatDate(userProgress.lastActivity)}
              </div>
              <p className="text-xs text-muted-foreground">
                {userProgress.achievements.length} achievements earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Course Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const course = courses.find(
                  (c) => c.id === enrollment.courseId,
                );
                if (!course) return null;

                return (
                  <div
                    key={enrollment.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpenIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enrolled: {formatDate(enrollment.enrolledAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            enrollment.status === 'completed'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            enrollment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : ''
                          }
                        >
                          {enrollment.status === 'completed' && (
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                          )}
                          {enrollment.status.charAt(0).toUpperCase() +
                            enrollment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        Time spent: {formatDuration(enrollment.totalTimeSpent)}
                      </span>
                      <span>
                        Last accessed: {formatDate(enrollment.lastAccessed)}
                      </span>
                    </div>

                    {enrollment.certificateIssued && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <TrophyIcon className="w-4 h-4" />
                        <span>Certificate Issued</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <StarIcon className="w-5 h-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userProgress.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default UserDashboard;
