import Loader from '@/common/Loader';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';

const StatsCard = () => {
  const [statsData, setStatsData] = useState<any>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}analytics/basicreport`)
      .then((response) => {
        setStatsData(response.data);
        setLoading(false);
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
        <div className="col-span-12 rounded-lg border border-stroke bg-white p-8 shadow-lg dark:border-strokedark dark:bg-boxdark">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ShowData Title="Total Users" Number={statsData.total_users} />
            <ShowData Title="Total Course" Number={statsData.total_courses} />
            <ShowData Title="Total Revenue" Number={statsData.total_revenue} />
            <ShowData
              Title="User Comparison"
              Number={statsData.user_comparison}
            />
            <ShowData
              Title="Current Month Revenue"
              Number={statsData.current_month_revenue}
            />
            <ShowData
              Title="Current Month New Users"
              Number={statsData.current_month_new_users}
            />
            <ShowData
              Title="Revenue Comparison"
              Number={statsData.revenue_comparison}
            />
          </div>
        </div>
      )}
    </>
  );
};

const ShowData = ({ Title, Number }: { Title: string; Number: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0">
      <h4 className="mb-0.5 text-xl font-bold text-black dark:text-white md:text-title-lg">
        {Number}
      </h4>
      <p className="text-sm font-medium">{Title}</p>
    </div>
  );
};

export default StatsCard;
