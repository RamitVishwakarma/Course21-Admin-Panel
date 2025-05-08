import React, { useEffect, useState } from 'react';
import ChartOne from './components/ChartOne';
import DefaultLayout from '../../layout/DefaultLayout';
import StatsCard from '@/pages/Dashboard/components/StatsCard';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/common/Loader';
import TopPerformingCourses from './components/TopPerformingCourses';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

const ECommerce: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Get data and functions from our analytics store
  const { data, fetchAnalytics, isLoading } = useAnalyticsStore((state) => ({
    data: state.data,
    fetchAnalytics: state.fetchAnalytics,
    isLoading: state.isLoading,
  }));

  useEffect(() => {
    // Fetch all analytics data from our store
    fetchAnalytics();

    // Set loading to false when data is loaded
    if (!isLoading && data.topCourses.length > 0) {
      setLoading(false);
    }
  }, [fetchAnalytics, isLoading, data.topCourses]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <DefaultLayout>
          <div className="flex flex-col gap-4">
            <StatsCard />
            <ChartOne />
            <div className="flex flex-col gap-4 dark:bg-boxdark bg-white px-4 py-6 rounded-md">
              <h1 className="text-2xl font-bold dark:text-white text-black">
                Top Performing Courses
              </h1>
              <TopPerformingCourses courses={data.topCourses} />
            </div>
          </div>
        </DefaultLayout>
      )}
    </>
  );
};

export default ECommerce;
