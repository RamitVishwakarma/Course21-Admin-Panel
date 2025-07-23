import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

interface RevenueChartProps {
  data?: Array<{ month: string; revenue: number; enrollments: number }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data = [] }) => {
  // Generate sample data if none provided
  const sampleData =
    data.length > 0
      ? data
      : [
          { month: 'Jan', revenue: 45000, enrollments: 120 },
          { month: 'Feb', revenue: 52000, enrollments: 150 },
          { month: 'Mar', revenue: 48000, enrollments: 135 },
          { month: 'Apr', revenue: 61000, enrollments: 180 },
          { month: 'May', revenue: 58000, enrollments: 165 },
          { month: 'Jun', revenue: 67000, enrollments: 200 },
          { month: 'Jul', revenue: 72000, enrollments: 220 },
          { month: 'Aug', revenue: 69000, enrollments: 210 },
          { month: 'Sep', revenue: 75000, enrollments: 235 },
          { month: 'Oct', revenue: 81000, enrollments: 250 },
          { month: 'Nov', revenue: 78000, enrollments: 240 },
          { month: 'Dec', revenue: 85000, enrollments: 270 },
        ];

  const currentMonth = sampleData[sampleData.length - 1];
  const previousMonth = sampleData[sampleData.length - 2];

  const revenueGrowth = previousMonth
    ? (
        ((currentMonth.revenue - previousMonth.revenue) /
          previousMonth.revenue) *
        100
      ).toFixed(1)
    : '0';
  const enrollmentGrowth = previousMonth
    ? (
        ((currentMonth.enrollments - previousMonth.enrollments) /
          previousMonth.enrollments) *
        100
      ).toFixed(1)
    : '0';

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Monthly Performance
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current month vs previous month
        </p>
      </div>

      <div className="space-y-6">
        {/* Revenue Card */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                ₹{currentMonth.revenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center space-x-1 ${
              parseFloat(revenueGrowth) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {parseFloat(revenueGrowth) >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{revenueGrowth}%</span>
          </div>
        </div>

        {/* Enrollments Card */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Enrollments
              </p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {currentMonth.enrollments.toLocaleString()}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center space-x-1 ${
              parseFloat(enrollmentGrowth) >= 0
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {parseFloat(enrollmentGrowth) >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{enrollmentGrowth}%</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-lg font-bold text-black dark:text-white">
              ₹{(currentMonth.revenue / currentMonth.enrollments).toFixed(0)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Avg Revenue/Student
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-lg font-bold text-black dark:text-white">
              {sampleData
                .reduce((sum, month) => sum + month.enrollments, 0)
                .toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total Year Enrollments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
