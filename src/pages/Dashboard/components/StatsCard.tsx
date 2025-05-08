import Loader from '@/common/Loader';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

const StatsCard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Get data and functions from our analytics store
  const { data, fetchBasicReport, isLoading } = useAnalyticsStore((state) => ({
    data: state.data,
    fetchBasicReport: state.fetchBasicReport,
    isLoading: state.isLoading,
  }));

  useEffect(() => {
    // Fetch basic report data from our store
    fetchBasicReport();

    // Set loading to false when data is loaded
    if (!isLoading) {
      setLoading(false);
    }
  }, [fetchBasicReport, isLoading]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="col-span-12 rounded-lg border border-stroke bg-white p-8 shadow-lg dark:border-strokedark dark:bg-boxdark">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ShowData
              Title="Total Course"
              Number={data.totalCourses.toString()}
              Comparison={2}
            />
            <ShowData
              Title="Total Users"
              Number={data.totalUsers.toString()}
              Comparison={8}
            />
            <ShowData
              Title="Total Revenue"
              Number={`₹${(data.revenueThisMonth * 12).toLocaleString()}`}
              Comparison={5}
            />
            <ShowData
              Title="Monthly Revenue"
              Number={`₹${data.revenueThisMonth.toLocaleString()}`}
            />
            <ShowData
              Title="New Users"
              Number={(data.totalUsers * 0.1).toFixed(0)}
            />
          </div>
        </div>
      )}
    </>
  );
};

const ShowData = ({
  Title,
  Number,
  Comparison = 0,
}: {
  Title: string;
  Number: string;
  Comparison?: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0">
      <div className="flex gap-2 items-center justify-center">
        <h4 className="text-xl font-bold text-black dark:text-white md:text-title-lg">
          {Number}
        </h4>
        {Comparison === 0 ? (
          <div className="flex items-center text-meta-3">
            <p className="text-meta-2 opacity-20">{Comparison}%</p>
          </div>
        ) : Comparison >= 0 ? (
          <div className="flex items-center text-meta-3">
            <ArrowUp size={16} />
            <p>{Comparison}%</p>
          </div>
        ) : Comparison <= 0 ? (
          <div className="flex items-center text-meta-1">
            <ArrowDown size={16} />
            <p>{Comparison}%</p>
          </div>
        ) : null}
      </div>
      <p className="text-sm font-medium">{Title}</p>
    </div>
  );
};

export default StatsCard;
