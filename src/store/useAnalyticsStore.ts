import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  sampleAnalyticsOverview,
  sampleCourseAnalytics,
  sampleRevenueAnalytics,
  sampleEngagementAnalytics,
  sampleDashboardMetrics,
} from '../data/sample/analytics';
import {
  type AnalyticsOverview,
  type CourseAnalytics,
  type RevenueAnalytics,
  type EngagementAnalytics,
  type DashboardMetrics as BaseDashboardMetrics,
  type DataPoint,
} from '../types';

// Enhanced dashboard metrics interface
export interface EnhancedDashboardMetrics extends BaseDashboardMetrics {
  revenueGrowth: number; // percentage
  userGrowth: number; // percentage
  topPerformingCourse: string;
  mostActiveUsers: number;
}

export interface ChartData {
  userGrowth: { label: string; value: number }[];
  revenueGrowth: { label: string; value: number }[];
  coursePerformance: CourseAnalytics[];
  completionRates: { courseId: string; courseName: string; rate: number }[];
  monthlyEnrollments: { month: string; enrollments: number }[];
  paymentMethodDistribution: {
    method: string;
    amount: number;
    percentage: number;
  }[];
}

export interface RealtimeMetrics {
  activeUsers: number;
  todayEnrollments: number;
  todayRevenue: number;
  todayCompletions: number;
  avgSessionDuration: number;
  bounceRate: number;
}

interface AnalyticsStore {
  overview: AnalyticsOverview;
  courseAnalytics: CourseAnalytics[];
  revenueAnalytics: RevenueAnalytics;
  engagementAnalytics: EngagementAnalytics;
  dashboardMetrics: EnhancedDashboardMetrics | null;
  chartData: ChartData | null;
  realtimeMetrics: RealtimeMetrics | null;
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchAnalytics: () => Promise<void>;
  refreshDashboardMetrics: () => void;
  generateChartData: () => void;
  updateRealtimeMetrics: () => void;

  // Calculation methods
  calculateTotalRevenue: () => number;
  calculateUserGrowth: () => number;
  calculateRevenueGrowth: () => number;
  calculateAvgCompletionRate: () => number;
  getTopPerformingCourse: () => string;
  getCourseCompletionRates: () => {
    courseId: string;
    courseName: string;
    rate: number;
  }[];
  getMonthlyEnrollments: () => { month: string; enrollments: number }[];
  getPaymentMethodDistribution: () => {
    method: string;
    amount: number;
    percentage: number;
  }[];

  // Update methods
  updateCourseAnalytics: (
    courseId: string,
    data: Partial<CourseAnalytics>,
  ) => void;
  addRevenueEntry: (amount: number, method: string, courseId?: string) => void;
  incrementUserCount: () => void;
  updateCompletionRate: (courseId: string, newRate: number) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      overview: {} as AnalyticsOverview,
      courseAnalytics: [],
      revenueAnalytics: {} as RevenueAnalytics,
      engagementAnalytics: {} as EngagementAnalytics,
      dashboardMetrics: null,
      chartData: null,
      realtimeMetrics: null,
      isLoading: false,
      error: null,

      fetchAnalytics: async () => {
        try {
          set({ isLoading: true });
          const currentOverview = get().overview;

          // Always load sample data if not present
          if (
            !currentOverview.totalRevenue ||
            currentOverview.totalRevenue === 0
          ) {
            set({
              overview: sampleAnalyticsOverview,
              courseAnalytics: sampleCourseAnalytics,
              revenueAnalytics: sampleRevenueAnalytics,
              engagementAnalytics: sampleEngagementAnalytics,
              isLoading: false,
            });

            // Force generation of dependent data
            setTimeout(() => {
              get().refreshDashboardMetrics();
              get().generateChartData();
              get().updateRealtimeMetrics();
            }, 100);
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error fetching analytics:', error);
          set({ error: 'Failed to fetch analytics', isLoading: false });
        }
      },

      refreshDashboardMetrics: () => {
        const { overview, courseAnalytics } = get();

        const topCourse =
          courseAnalytics.length > 0
            ? courseAnalytics.reduce((prev, current) =>
                prev.totalRevenue > current.totalRevenue ? prev : current,
              )
            : null;

        const enhancedMetrics: EnhancedDashboardMetrics = {
          ...sampleDashboardMetrics,
          revenueGrowth: overview.revenueGrowth,
          userGrowth: overview.userGrowth,
          topPerformingCourse: topCourse?.courseName || 'N/A',
          mostActiveUsers: overview.activeUsers,
        };

        set({ dashboardMetrics: enhancedMetrics });
      },

      generateChartData: () => {
        const { revenueAnalytics, courseAnalytics, engagementAnalytics } =
          get();

        // Generate monthly data for better chart visualization
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        // Generate realistic user growth data
        const userGrowthData = months.map((month, index) => ({
          label: month,
          value: Math.floor(2000 + index * 500 + Math.random() * 1000),
        }));

        // Generate realistic revenue growth data (in thousands for better display)
        const revenueGrowthData = months.map((month, index) => ({
          label: month,
          value: Math.floor(5000 + index * 2000 + Math.random() * 3000) * 1000, // Convert to actual amounts
        }));

        console.log('Generated Chart Data:', {
          userGrowthData,
          revenueGrowthData,
          courseAnalytics,
        });

        const chartData: ChartData = {
          userGrowth: userGrowthData,
          revenueGrowth: revenueGrowthData,
          coursePerformance: courseAnalytics,
          completionRates: courseAnalytics.map((course) => ({
            courseId: course.courseId,
            courseName: course.courseName,
            rate: course.completionRate,
          })),
          monthlyEnrollments: months.slice(-6).map((month, index) => ({
            month: month,
            enrollments: Math.floor(1000 + index * 200 + Math.random() * 500),
          })),
          paymentMethodDistribution: revenueAnalytics.paymentMethods?.map(
            (pm) => ({
              method: pm.method,
              amount: pm.revenue,
              percentage: pm.percentage,
            }),
          ) || [
            { method: 'UPI', amount: 382250000, percentage: 45.2 },
            {
              method: 'Credit/Debit Card',
              amount: 189850000,
              percentage: 32.8,
            },
            { method: 'Net Banking', amount: 95750000, percentage: 16.3 },
            { method: 'Digital Wallet', amount: 41650000, percentage: 5.7 },
          ],
        };

        set({ chartData });
        console.log('Chart data set in store:', chartData);
      },

      updateRealtimeMetrics: () => {
        const { overview, engagementAnalytics } = get();

        const realtimeMetrics: RealtimeMetrics = {
          activeUsers: overview.activeUsers,
          todayEnrollments: Math.floor(overview.totalEnrollments * 0.02),
          todayRevenue: Math.floor(overview.totalRevenue * 0.003),
          todayCompletions: Math.floor(overview.totalEnrollments * 0.01),
          avgSessionDuration: engagementAnalytics.sessionDuration.average,
          bounceRate: 25, // Default bounce rate for demo
        };

        set({ realtimeMetrics });
      },

      calculateTotalRevenue: () => get().overview.totalRevenue,
      calculateUserGrowth: () => get().overview.userGrowth,
      calculateRevenueGrowth: () => get().overview.revenueGrowth,
      calculateAvgCompletionRate: () => get().overview.averageCompletionRate,

      getTopPerformingCourse: () => {
        const courseAnalytics = get().courseAnalytics;
        if (courseAnalytics.length === 0) return 'N/A';
        const topCourse = courseAnalytics.reduce((prev, current) =>
          prev.totalRevenue > current.totalRevenue ? prev : current,
        );
        return topCourse?.courseName || 'N/A';
      },

      getCourseCompletionRates: () => {
        return get().courseAnalytics.map((course) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          rate: course.completionRate,
        }));
      },

      getMonthlyEnrollments: () => {
        const courseAnalytics = get().courseAnalytics;
        const monthlyData = courseAnalytics.reduce(
          (acc, course) => {
            course.enrollmentTrend.forEach((point) => {
              const existing = acc.find((item) => item.month === point.label);
              if (existing) {
                existing.enrollments += point.value;
              } else {
                acc.push({ month: point.label, enrollments: point.value });
              }
            });
            return acc;
          },
          [] as { month: string; enrollments: number }[],
        );

        return monthlyData;
      },

      getPaymentMethodDistribution: () => {
        return (
          get().revenueAnalytics.paymentMethods.map((pm) => ({
            method: pm.method,
            amount: pm.revenue,
            percentage: pm.percentage,
          })) || []
        );
      },

      updateCourseAnalytics: (courseId, data) => {
        set((state) => ({
          courseAnalytics: state.courseAnalytics.map((course) =>
            course.courseId === courseId ? { ...course, ...data } : course,
          ),
        }));
      },

      addRevenueEntry: (amount, method, courseId) => {
        set((state) => {
          const updatedOverview = {
            ...state.overview,
            totalRevenue: state.overview.totalRevenue + amount,
          };

          let updatedCourseAnalytics = state.courseAnalytics;
          if (courseId) {
            updatedCourseAnalytics = state.courseAnalytics.map((course) =>
              course.courseId === courseId
                ? { ...course, totalRevenue: course.totalRevenue + amount }
                : course,
            );
          }

          return {
            overview: updatedOverview,
            courseAnalytics: updatedCourseAnalytics,
          };
        });
      },

      incrementUserCount: () => {
        set((state) => ({
          overview: {
            ...state.overview,
            totalUsers: state.overview.totalUsers + 1,
          },
        }));
      },

      updateCompletionRate: (courseId, newRate) => {
        set((state) => ({
          courseAnalytics: state.courseAnalytics.map((course) =>
            course.courseId === courseId
              ? { ...course, completionRate: newRate }
              : course,
          ),
        }));
      },
    }),
    {
      name: 'analytics-store',
    },
  ),
);

export default useAnalyticsStore;
