import { create } from 'zustand';

// Sample analytics data
const AnalyticsData = {
  totalCourses: 12,
  totalModules: 48,
  totalLectures: 192,
  totalUsers: 2450,
  visitorsToday: 156,
  visitorsThisWeek: 987,
  visitorsThisMonth: 3256,
  revenueToday: 2500,
  revenueThisWeek: 15000,
  revenueThisMonth: 85000,
  userGrowthData: [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 600 },
    { name: 'Mar', users: 510 },
    { name: 'Apr', users: 800 },
    { name: 'May', users: 700 },
    { name: 'Jun', users: 1200 },
    { name: 'Jul', users: 900 },
    { name: 'Aug', users: 1100 },
    { name: 'Sep', users: 1400 },
    { name: 'Oct', users: 900 },
    { name: 'Nov', users: 1700 },
    { name: 'Dec', users: 2000 },
  ],
  revenueGrowthData: [
    { name: 'Jan', revenue: 40000 },
    { name: 'Feb', revenue: 60000 },
    { name: 'Mar', revenue: 51000 },
    { name: 'Apr', revenue: 80000 },
    { name: 'May', revenue: 70000 },
    { name: 'Jun', revenue: 120000 },
    { name: 'Jul', revenue: 90000 },
    { name: 'Aug', revenue: 110000 },
    { name: 'Sep', revenue: 140000 },
    { name: 'Oct', revenue: 90000 },
    { name: 'Nov', revenue: 170000 },
    { name: 'Dec', revenue: 200000 },
  ],
  topCourses: [
    { id: 1, name: 'JavaScript Fundamentals', students: 450, revenue: 45000 },
    { id: 2, name: 'React Complete Guide', students: 380, revenue: 38000 },
    { id: 3, name: 'Node.js Masterclass', students: 320, revenue: 32000 },
    { id: 4, name: 'Python for Beginners', students: 300, revenue: 30000 },
    { id: 5, name: 'Data Science with Python', students: 280, revenue: 28000 },
  ],
};

interface AnalyticsStore {
  data: typeof AnalyticsData;
  isLoading: boolean;
  error: string | null;

  // Fetch operations
  fetchAnalytics: () => void;
  fetchBasicReport: () => void;
  fetchChartData: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  data: {
    totalCourses: 0,
    totalModules: 0,
    totalLectures: 0,
    totalUsers: 0,
    visitorsToday: 0,
    visitorsThisWeek: 0,
    visitorsThisMonth: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    userGrowthData: [],
    revenueGrowthData: [],
    topCourses: [],
  },
  isLoading: false,
  error: null,

  fetchAnalytics: () => {
    set({ isLoading: true, error: null });
    try {
      // Instead of API call, use dummy data
      setTimeout(() => {
        set({
          data: AnalyticsData,
          isLoading: false,
        });
      }, 500);
    } catch (error) {
      set({ error: 'Failed to fetch analytics data', isLoading: false });
    }
  },

  fetchBasicReport: () => {
    set({ isLoading: true, error: null });
    try {
      // Return a subset of the analytics data
      setTimeout(() => {
        set((state) => ({
          data: {
            ...state.data,
            totalCourses: AnalyticsData.totalCourses,
            totalModules: AnalyticsData.totalModules,
            totalLectures: AnalyticsData.totalLectures,
            totalUsers: AnalyticsData.totalUsers,
          },
          isLoading: false,
        }));
      }, 500);
    } catch (error) {
      set({ error: 'Failed to fetch basic report', isLoading: false });
    }
  },

  fetchChartData: () => {
    set({ isLoading: true, error: null });
    try {
      // Return chart data
      setTimeout(() => {
        set((state) => ({
          data: {
            ...state.data,
            userGrowthData: AnalyticsData.userGrowthData,
            revenueGrowthData: AnalyticsData.revenueGrowthData,
          },
          isLoading: false,
        }));
      }, 500);
    } catch (error) {
      set({ error: 'Failed to fetch chart data', isLoading: false });
    }
  },
}));
