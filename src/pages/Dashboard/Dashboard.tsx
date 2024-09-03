import React, { useEffect, useState } from 'react';
import ChartOne from './components/ChartOne';
import DefaultLayout from '../../layout/DefaultLayout';
import StatsCard from '@/pages/Dashboard/components/StatsCard';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/common/Loader';
import TopPerformingCourses from './components/TopPerformingCourses';

const ECommerce: React.FC = () => {
  const [topPerformingCourses, setTopPerformingCourses] = useState<any>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}analytics/trends?limit=5&offset=0`,
      )
      .then((response) => {
        setTopPerformingCourses(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch(() => {
        toast({
          title: 'An error occurred while fetching data',
          variant: 'destructive',
        });
      });
  }, []);

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
              <TopPerformingCourses courses={topPerformingCourses} />
            </div>
          </div>
        </DefaultLayout>
      )}
    </>
  );
};

export default ECommerce;
