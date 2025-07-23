import React, { useEffect, useState } from 'react';
import ChartOne from './components/ChartOne';
import DefaultLayout from '../../layout/DefaultLayout';
import StatsCard from '@/pages/Dashboard/components/StatsCard';
import Loader from '@/components/ui/loader';
import TopPerformingCourses from './components/TopPerformingCourses';
import RevenueChart from './components/RevenueChart';
import UserEngagementChart from './components/UserEngagementChart';
import CourseFeedbackWidget from './components/CourseFeedbackWidget';
import ActivityTimeline from './components/ActivityTimeline';
import PerformanceMetrics from './components/PerformanceMetrics';
import QuickStatsOverview from './components/QuickStatsOverview';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

const ECommerce: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const {
    overview,
    courseAnalytics,
    dashboardMetrics,
    chartData,
    isLoading,
    fetchAnalytics,
    refreshDashboardMetrics,
    generateChartData,
  } = useAnalyticsStore();

  useEffect(() => {
    // Load analytics data from localStorage or JSON on first render
    const loadData = async () => {
      console.log('Dashboard: Starting data load...');
      await fetchAnalytics();

      // Add small delay to ensure store is updated
      setTimeout(() => {
        refreshDashboardMetrics();
        generateChartData();
        console.log('Dashboard: Data generation complete');
        setLoading(false);
      }, 200);
    };
    loadData();
  }, [fetchAnalytics, refreshDashboardMetrics, generateChartData]);

  // Log current data state
  useEffect(() => {
    console.log('Dashboard data state:', {
      overview,
      courseAnalytics: courseAnalytics?.length,
      chartData: chartData ? 'present' : 'missing',
      dashboardMetrics: dashboardMetrics ? 'present' : 'missing',
    });
  }, [overview, courseAnalytics, chartData, dashboardMetrics]);

  // Auto-refresh dashboard metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboardMetrics();
      generateChartData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshDashboardMetrics, generateChartData]);

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        {/* Stats Cards */}
        <StatsCard metrics={dashboardMetrics} overview={overview} />

        {/* Quick Stats Overview */}
        <QuickStatsOverview />

        {/* Performance Metrics */}
        <PerformanceMetrics />

        {/* Main Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <ChartOne chartData={chartData} />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <RevenueChart />
          </div>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-12 gap-6">
          <UserEngagementChart />
          <ActivityTimeline />
        </div>

        {/* Feedback and Top Courses Row */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <CourseFeedbackWidget />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 min-w-0 mb-6 xl:mb-0">
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark h-full flex flex-col">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Top Performing Courses
              </h3>
              <TopPerformingCourses courses={courseAnalytics || []} />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ECommerce;
