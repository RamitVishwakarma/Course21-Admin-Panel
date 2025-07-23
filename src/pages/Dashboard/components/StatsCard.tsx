import Loader from '@/components/ui/loader';
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
  Award,
} from 'lucide-react';
import { type AnalyticsOverview } from '@/types';

interface StatsCardProps {
  metrics?: any;
  overview?: AnalyticsOverview;
}

const StatsCard = ({ overview }: StatsCardProps) => {
  if (!overview) {
    return <Loader />;
  }

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-8 shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <ShowData
          Title="Total Courses"
          Number={overview.totalCourses.toString()}
          Comparison={overview.courseGrowth}
          icon={<BookOpen className="w-5 h-5" />}
          color="text-blue-500"
        />
        <ShowData
          Title="Total Users"
          Number={overview.totalUsers.toLocaleString()}
          Comparison={overview.userGrowth}
          icon={<Users className="w-5 h-5" />}
          color="text-green-500"
        />
        <ShowData
          Title="Total Revenue"
          Number={`₹${Math.floor(
            overview.totalRevenue / 100000,
          ).toLocaleString()}L`}
          Comparison={overview.revenueGrowth}
          icon={<DollarSign className="w-5 h-5" />}
          color="text-yellow-500"
        />
        <ShowData
          Title="Total Enrollments"
          Number={overview.totalEnrollments.toLocaleString()}
          Comparison={overview.enrollmentGrowth}
          icon={<UserCheck className="w-5 h-5" />}
          color="text-purple-500"
        />
        <ShowData
          Title="Active Instructors"
          Number="8"
          Comparison={12}
          icon={<Award className="w-5 h-5" />}
          color="text-orange-500"
        />
        <ShowData
          Title="Monthly Growth"
          Number={`${overview.revenueGrowth > 0 ? '+' : ''}${
            overview.revenueGrowth
          }%`}
          Comparison={overview.revenueGrowth}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-indigo-500"
        />
      </div>
    </div>
  );
};

const ShowData = ({
  Title,
  Number,
  Comparison = 0,
  icon,
  color = 'text-gray-500',
}: {
  Title: string;
  Number: string;
  Comparison?: number;
  icon?: React.ReactNode;
  color?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0">
      {icon && (
        <div className={`p-3 rounded-full bg-opacity-10 ${color} bg-current`}>
          <div className={color}>{icon}</div>
        </div>
      )}
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
      <p className="text-sm font-medium text-center">{Title}</p>
    </div>
  );
};

export default StatsCard;
