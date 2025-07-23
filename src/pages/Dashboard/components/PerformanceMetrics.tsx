import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  BarChart3,
} from 'lucide-react';

interface PerformanceMetric {
  label: string;
  value: string;
  change: number;
  target: number;
  status: 'up' | 'down' | 'stable';
  color: string;
}

interface PerformanceMetricsProps {
  data?: PerformanceMetric[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const defaultMetrics: PerformanceMetric[] = [
    {
      label: 'Course Completion Rate',
      value: '78.5%',
      change: 5.2,
      target: 85,
      status: 'up',
      color: 'text-green-600',
    },
    {
      label: 'Student Satisfaction',
      value: '4.6/5.0',
      change: 0.3,
      target: 4.5,
      status: 'up',
      color: 'text-blue-600',
    },
    {
      label: 'Avg. Session Duration',
      value: '47 min',
      change: -3.1,
      target: 50,
      status: 'down',
      color: 'text-orange-600',
    },
    {
      label: 'Knowledge Retention',
      value: '84.2%',
      change: 2.8,
      target: 80,
      status: 'up',
      color: 'text-purple-600',
    },
    {
      label: 'Active Learning Hours',
      value: '1,247h',
      change: 12.5,
      target: 1200,
      status: 'up',
      color: 'text-teal-600',
    },
    {
      label: 'Course Engagement',
      value: '92.1%',
      change: 1.7,
      target: 90,
      status: 'up',
      color: 'text-indigo-600',
    },
  ];

  const metrics = data || defaultMetrics;

  const getProgressPercentage = (value: string, target: number) => {
    const numValue = parseFloat(value.replace(/[^\d.]/g, ''));
    return Math.min((numValue / target) * 100, 100);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Performance Metrics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Key performance indicators and targets
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Live Data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`p-1.5 rounded-md ${metric.color} bg-opacity-10`}
                >
                  {index % 3 === 0 ? (
                    <Target className={`w-4 h-4 ${metric.color}`} />
                  ) : index % 3 === 1 ? (
                    <Zap className={`w-4 h-4 ${metric.color}`} />
                  ) : (
                    <BarChart3 className={`w-4 h-4 ${metric.color}`} />
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric.label}
                </h4>
              </div>
              <div
                className={`flex items-center space-x-1 ${
                  metric.status === 'up'
                    ? 'text-green-500'
                    : metric.status === 'down'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {metric.status === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : metric.status === 'down' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-black dark:text-white">
                  {metric.value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Target: {metric.target}
                  {metric.label.includes('Rate') ||
                  metric.label.includes('Satisfaction') ||
                  metric.label.includes('Engagement') ||
                  metric.label.includes('Retention')
                    ? '%'
                    : ''}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Progress</span>
                  <span>
                    {getProgressPercentage(metric.value, metric.target).toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      metric.status === 'up'
                        ? 'bg-green-500'
                        : metric.status === 'down'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                    style={{
                      width: `${getProgressPercentage(
                        metric.value,
                        metric.target,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Status Indicator */}
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  getProgressPercentage(metric.value, metric.target) >= 100
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : getProgressPercentage(metric.value, metric.target) >= 80
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {getProgressPercentage(metric.value, metric.target) >= 100
                  ? 'Target Achieved'
                  : getProgressPercentage(metric.value, metric.target) >= 80
                  ? 'On Track'
                  : 'Needs Attention'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {
                metrics.filter(
                  (m) => getProgressPercentage(m.value, m.target) >= 100,
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Targets Met
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              {
                metrics.filter(
                  (m) =>
                    getProgressPercentage(m.value, m.target) >= 80 &&
                    getProgressPercentage(m.value, m.target) < 100,
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">On Track</p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              {
                metrics.filter(
                  (m) => getProgressPercentage(m.value, m.target) < 80,
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Needs Attention
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {(
                (metrics.filter((m) => m.status === 'up').length /
                  metrics.length) *
                100
              ).toFixed(0)}
              %
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Improving
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
