import React from 'react';
import {
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Award,
  Globe,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface QuickStat {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface QuickStatsOverviewProps {
  data?: QuickStat[];
}

const QuickStatsOverview: React.FC<QuickStatsOverviewProps> = ({ data }) => {
  const defaultStats: QuickStat[] = [
    {
      label: 'Active Students',
      value: '2,847',
      subValue: 'Online now: 156',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: { value: 12.5, isPositive: true },
    },
    {
      label: 'Course Completions',
      value: '1,234',
      subValue: 'This month',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: { value: 8.3, isPositive: true },
    },
    {
      label: 'Learning Hours',
      value: '15.6K',
      subValue: 'Total this week',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      trend: { value: 5.7, isPositive: true },
    },
    {
      label: 'New Enrollments',
      value: '456',
      subValue: 'Last 7 days',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: { value: 23.1, isPositive: true },
    },
    {
      label: 'Certificates Earned',
      value: '89',
      subValue: 'This month',
      icon: <Award className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      trend: { value: 15.8, isPositive: true },
    },
    {
      label: 'Countries Reached',
      value: '47',
      subValue: 'Global presence',
      icon: <Globe className="w-6 h-6" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      trend: { value: 4.2, isPositive: true },
    },
    {
      label: 'Upcoming Events',
      value: '12',
      subValue: 'Next 30 days',
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Platform Uptime',
      value: '99.9%',
      subValue: 'Last 30 days',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      trend: { value: 0.1, isPositive: true },
    },
  ];

  const stats = data || defaultStats;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Quick Stats Overview
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time platform statistics and activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-xl ${stat.bgColor} border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${stat.color} bg-white dark:bg-gray-800 shadow-sm`}
                  >
                    {stat.icon}
                  </div>
                  {stat.trend && (
                    <div
                      className={`flex items-center space-x-1 text-xs font-medium ${
                        stat.trend.isPositive
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      <TrendingUp
                        className={`w-3 h-3 ${
                          stat.trend.isPositive ? '' : 'rotate-180'
                        }`}
                      />
                      <span>{stat.trend.value}%</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-black dark:text-white">
                    {stat.value}
                  </h4>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </p>
                  {stat.subValue && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.subValue}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today's Activity
              </p>
              <p className="text-lg font-semibold text-black dark:text-white">
                High
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                System Health
              </p>
              <p className="text-lg font-semibold text-green-600">Excellent</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Growth Rate
              </p>
              <p className="text-lg font-semibold text-blue-600">+12.5%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live data • Updated now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsOverview;
