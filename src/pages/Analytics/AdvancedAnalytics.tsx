import { useState, useEffect } from 'react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useCourseStore } from '../../store/useCourseStore';
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
  UsersIcon,
  BookOpenIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  AcademicCapIcon,
  ClockIcon,
  CalendarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import DefaultLayout from '../../layout/DefaultLayout';

interface AnalyticsMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalUsers: number;
  userGrowth: number;
  totalCourses: number;
  courseGrowth: number;
  totalEnrollments: number;
  enrollmentGrowth: number;
  averageCompletionRate: number;
  completionRateChange: number;
  averageSessionDuration: number;
  sessionDurationChange: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  topPerformingCourse: string;
  lowPerformingCourse: string;
}

interface CourseAnalytics {
  courseId: string;
  courseName: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  revenue: number;
  averageRating: number;
  totalWatchTime: number;
  dropoffRate: number;
  engagement: number;
}

interface UserBehaviorAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  peakHours: string[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicDistribution: {
    state: string;
    users: number;
    percentage: number;
  }[];
}

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter' | 'year'
  >('month');
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [userBehavior, setUserBehavior] =
    useState<UserBehaviorAnalytics | null>(null);

  const { fetchAnalytics } = useAnalyticsStore();
  const { courses, fetchCourses } = useCourseStore();
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);

      // Fetch data if not already loaded
      await fetchAnalytics();
      if (courses.length === 0) await fetchCourses();
      if (users.length === 0) await fetchUsers();

      // Generate comprehensive analytics metrics
      const mockMetrics: AnalyticsMetrics = {
        totalRevenue: 2847500, // ₹28,47,500
        revenueGrowth: 23.5,
        totalUsers: users.length || 156,
        userGrowth: 18.2,
        totalCourses: courses.length || 18,
        courseGrowth: 12.5,
        totalEnrollments: 1247,
        enrollmentGrowth: 31.8,
        averageCompletionRate: 73.2,
        completionRateChange: 5.4,
        averageSessionDuration: 42.5, // minutes
        sessionDurationChange: 8.3,
        activeUsersToday: 89,
        activeUsersWeek: 234,
        topPerformingCourse: 'React Advanced Concepts',
        lowPerformingCourse: 'Basic HTML & CSS',
      };

      // Generate course-specific analytics
      const mockCourseAnalytics: CourseAnalytics[] = courses
        .slice(0, 10)
        .map((course) => ({
          courseId: course.id,
          courseName: course.title,
          enrollments: Math.floor(Math.random() * 200) + 50,
          completions: Math.floor(Math.random() * 150) + 30,
          completionRate: Math.floor(Math.random() * 40) + 60,
          revenue: Math.floor(Math.random() * 500000) + 100000,
          averageRating: (Math.random() * 2 + 3).toFixed(1) as any,
          totalWatchTime: Math.floor(Math.random() * 10000) + 5000, // minutes
          dropoffRate: Math.floor(Math.random() * 30) + 10,
          engagement: Math.floor(Math.random() * 40) + 60,
        }));

      // Generate user behavior analytics
      const mockUserBehavior: UserBehaviorAnalytics = {
        totalPageViews: 15420,
        uniqueVisitors: 1256,
        averageSessionDuration: 25.3,
        bounceRate: 34.7,
        peakHours: ['10:00-11:00', '14:00-15:00', '19:00-20:00'],
        deviceBreakdown: {
          desktop: 65.4,
          mobile: 28.7,
          tablet: 5.9,
        },
        geographicDistribution: [
          { state: 'Maharashtra', users: 245, percentage: 28.5 },
          { state: 'Karnataka', users: 189, percentage: 22.1 },
          { state: 'Delhi', users: 156, percentage: 18.2 },
          { state: 'Tamil Nadu', users: 134, percentage: 15.6 },
          { state: 'Gujarat', users: 98, percentage: 11.4 },
          { state: 'Others', users: 98, percentage: 4.2 },
        ],
      };

      setMetrics(mockMetrics);
      setCourseAnalytics(mockCourseAnalytics);
      setUserBehavior(mockUserBehavior);
      setLoading(false);
    };

    loadAnalyticsData();
  }, [
    selectedPeriod,
    courses,
    users,
    fetchAnalytics,
    fetchCourses,
    fetchUsers,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const exportAnalytics = () => {
    // Mock export functionality
    const exportData = {
      period: selectedPeriod,
      metrics,
      courseAnalytics,
      userBehavior,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${selectedPeriod}-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || !metrics || !userBehavior) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Advanced Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <Button onClick={exportAnalytics} variant="outline">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => window.location.reload()}>
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <CurrencyRupeeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.totalRevenue)}
              </div>
              <div
                className={`flex items-center text-xs ${getTrendColor(
                  metrics.revenueGrowth,
                )}`}
              >
                {getTrendIcon(metrics.revenueGrowth)}
                <span className="ml-1">
                  +{metrics.revenueGrowth}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics.totalUsers)}
              </div>
              <div
                className={`flex items-center text-xs ${getTrendColor(
                  metrics.userGrowth,
                )}`}
              >
                {getTrendIcon(metrics.userGrowth)}
                <span className="ml-1">
                  +{metrics.userGrowth}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Enrollments
              </CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics.totalEnrollments)}
              </div>
              <div
                className={`flex items-center text-xs ${getTrendColor(
                  metrics.enrollmentGrowth,
                )}`}
              >
                {getTrendIcon(metrics.enrollmentGrowth)}
                <span className="ml-1">
                  +{metrics.enrollmentGrowth}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <AcademicCapIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.averageCompletionRate}%
              </div>
              <div
                className={`flex items-center text-xs ${getTrendColor(
                  metrics.completionRateChange,
                )}`}
              >
                {getTrendIcon(metrics.completionRateChange)}
                <span className="ml-1">
                  +{metrics.completionRateChange}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Session Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Session Duration</span>
                  <span className="font-semibold">
                    {metrics.averageSessionDuration} mins
                  </span>
                </div>
                <div
                  className={`text-xs ${getTrendColor(
                    metrics.sessionDurationChange,
                  )}`}
                >
                  +{metrics.sessionDurationChange}% from last period
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Users Today</span>
                  <span className="font-semibold">
                    {metrics.activeUsersToday}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Users This Week</span>
                  <span className="font-semibold">
                    {metrics.activeUsersWeek}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <EyeIcon className="w-5 h-5 mr-2" />
                User Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Page Views</span>
                  <span className="font-semibold">
                    {formatNumber(userBehavior.totalPageViews)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Unique Visitors</span>
                  <span className="font-semibold">
                    {formatNumber(userBehavior.uniqueVisitors)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="font-semibold">
                    {userBehavior.bounceRate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Desktop</span>
                  <span className="font-semibold">
                    {userBehavior.deviceBreakdown.desktop}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Mobile</span>
                  <span className="font-semibold">
                    {userBehavior.deviceBreakdown.mobile}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Tablet</span>
                  <span className="font-semibold">
                    {userBehavior.deviceBreakdown.tablet}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Course Name</th>
                    <th className="text-left py-2">Enrollments</th>
                    <th className="text-left py-2">Completion Rate</th>
                    <th className="text-left py-2">Revenue</th>
                    <th className="text-left py-2">Rating</th>
                    <th className="text-left py-2">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {courseAnalytics.map((course) => (
                    <tr key={course.courseId} className="border-b">
                      <td className="py-3">
                        <div className="font-medium">{course.courseName}</div>
                        <div className="text-sm text-gray-500">
                          {formatNumber(course.totalWatchTime)} mins watched
                        </div>
                      </td>
                      <td className="py-3">
                        {formatNumber(course.enrollments)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <span className="mr-2">{course.completionRate}%</span>
                          <Badge
                            variant={
                              course.completionRate >= 70
                                ? 'default'
                                : 'secondary'
                            }
                            className={
                              course.completionRate >= 70
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {course.completionRate >= 70
                              ? 'Good'
                              : 'Needs Improvement'}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3">{formatCurrency(course.revenue)}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <span className="mr-1">⭐</span>
                          <span>{course.averageRating}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.engagement}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {course.engagement}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {userBehavior.geographicDistribution.map((location) => (
                  <div
                    key={location.state}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{location.state}</div>
                      <div className="text-sm text-gray-500">
                        {formatNumber(location.users)} users
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {location.percentage}%
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-3">Peak Activity Hours</h3>
                <div className="space-y-2">
                  {userBehavior.peakHours.map((hour, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {hour}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default AdvancedAnalytics;
