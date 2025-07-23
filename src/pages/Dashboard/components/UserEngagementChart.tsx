import React from 'react';
import { Clock, BookOpen, Trophy, Target } from 'lucide-react';

interface UserEngagementProps {
  data?: {
    avgSessionTime: number;
    completionRate: number;
    activeUsers: number;
    certificatesIssued: number;
  };
}

const UserEngagementChart: React.FC<UserEngagementProps> = ({ data }) => {
  const engagementData = data || {
    avgSessionTime: 45,
    completionRate: 78,
    activeUsers: 1240,
    certificatesIssued: 89,
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          User Engagement
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Student activity and learning metrics
        </p>
      </div>

      <div className="space-y-4">
        {/* Average Session Time */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Session Time
              </p>
              <p className="text-xl font-bold text-black dark:text-white">
                {formatTime(engagementData.avgSessionTime)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{
                  width: `${Math.min(engagementData.avgSessionTime, 100)}%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Target: 60m
            </span>
          </div>
        </div>

        {/* Course Completion Rate */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completion Rate
              </p>
              <p className="text-xl font-bold text-black dark:text-white">
                {engagementData.completionRate}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${engagementData.completionRate}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Target: 85%
            </span>
          </div>
        </div>

        {/* Active Users */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users (7d)
              </p>
              <p className="text-xl font-bold text-black dark:text-white">
                {engagementData.activeUsers.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-green-500 text-right">
            <span className="text-sm font-medium">+12%</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              vs last week
            </p>
          </div>
        </div>

        {/* Certificates Issued */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Certificates Issued
              </p>
              <p className="text-xl font-bold text-black dark:text-white">
                {engagementData.certificatesIssued}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              This Month
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">89 total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementChart;
