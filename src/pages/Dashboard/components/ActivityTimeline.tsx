import React from 'react';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface UpcomingEvent {
  id: string;
  title: string;
  type: 'webinar' | 'course_launch' | 'deadline' | 'maintenance';
  date: string;
  time: string;
  attendees?: number;
  status: 'scheduled' | 'in_progress' | 'completed';
}

interface ActivityTimelineProps {
  events?: UpcomingEvent[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const defaultEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'React Advanced Patterns Webinar',
      type: 'webinar',
      date: '2024-01-15',
      time: '3:00 PM IST',
      attendees: 156,
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'New AI/ML Course Launch',
      type: 'course_launch',
      date: '2024-01-18',
      time: '12:00 PM IST',
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Assignment Deadline - JS Fundamentals',
      type: 'deadline',
      date: '2024-01-20',
      time: '11:59 PM IST',
      status: 'scheduled',
    },
    {
      id: '4',
      title: 'Server Maintenance Window',
      type: 'maintenance',
      date: '2024-01-22',
      time: '2:00 AM IST',
      status: 'scheduled',
    },
    {
      id: '5',
      title: 'Vue.js Workshop Completed',
      type: 'webinar',
      date: '2024-01-10',
      time: '2:00 PM IST',
      attendees: 89,
      status: 'completed',
    },
  ];

  const timelineEvents = events || defaultEvents;

  const getEventIcon = (type: UpcomingEvent['type']) => {
    switch (type) {
      case 'webinar':
        return <Users className="w-4 h-4" />;
      case 'course_launch':
        return <BookOpen className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      case 'maintenance':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (
    type: UpcomingEvent['type'],
    status: UpcomingEvent['status'],
  ) => {
    if (status === 'completed')
      return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600';

    switch (type) {
      case 'webinar':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'course_launch':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'deadline':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'maintenance':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getIconColor = (
    type: UpcomingEvent['type'],
    status: UpcomingEvent['status'],
  ) => {
    if (status === 'completed') return 'text-gray-500';

    switch (type) {
      case 'webinar':
        return 'text-blue-500';
      case 'course_launch':
        return 'text-green-500';
      case 'deadline':
        return 'text-red-500';
      case 'maintenance':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Activity Timeline
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upcoming events and recent activities
          </p>
        </div>
        <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {timelineEvents.map((event, index) => (
          <div
            key={event.id}
            className={`relative flex items-start space-x-3 p-4 rounded-lg border ${getEventColor(
              event.type,
              event.status,
            )}`}
          >
            {/* Timeline connector */}
            {index < timelineEvents.length - 1 && (
              <div className="absolute left-8 top-12 w-px h-6 bg-gray-300 dark:bg-gray-600" />
            )}

            {/* Event icon */}
            <div
              className={`flex-shrink-0 p-2 rounded-lg bg-white dark:bg-gray-700 ${getIconColor(
                event.type,
                event.status,
              )}`}
            >
              {getEventIcon(event.type)}
            </div>

            {/* Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4
                    className={`text-sm font-medium ${
                      event.status === 'completed'
                        ? 'text-gray-600 dark:text-gray-400 line-through'
                        : 'text-black dark:text-white'
                    }`}
                  >
                    {event.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(event.date)}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {event.time}
                    </span>
                  </div>
                  {event.attendees && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {event.attendees} attendees
                      </span>
                    </div>
                  )}
                </div>

                {event.status === 'scheduled' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Scheduled
                  </span>
                )}
                {event.status === 'completed' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-black dark:text-white">
              {timelineEvents.filter((e) => e.status === 'scheduled').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-black dark:text-white">
              {timelineEvents
                .filter((e) => e.status === 'completed' && e.attendees)
                .reduce((sum, e) => sum + (e.attendees || 0), 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Attendees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
