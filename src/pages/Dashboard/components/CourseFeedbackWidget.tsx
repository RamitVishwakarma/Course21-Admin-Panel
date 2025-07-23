import React from 'react';
import { Star, MessageCircle, ThumbsUp, AlertCircle } from 'lucide-react';

interface CourseFeedbackProps {
  data?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: number[];
    topFeedback: Array<{
      course: string;
      rating: number;
      comment: string;
      student: string;
    }>;
  };
}

const CourseFeedbackWidget: React.FC<CourseFeedbackProps> = ({ data }) => {
  const feedbackData = data || {
    averageRating: 4.6,
    totalReviews: 234,
    ratingDistribution: [15, 8, 12, 65, 134], // 1-star to 5-star counts
    topFeedback: [
      {
        course: 'Advanced React Development',
        rating: 5,
        comment: 'Excellent course with practical examples!',
        student: 'John Doe',
      },
      {
        course: 'JavaScript Fundamentals',
        rating: 4,
        comment: 'Good content, clear explanations.',
        student: 'Jane Smith',
      },
      {
        course: 'Node.js Backend Development',
        rating: 5,
        comment: 'Loved the hands-on approach!',
        student: 'Mike Johnson',
      },
    ],
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingPercentage = (starIndex: number) => {
    const total = feedbackData.ratingDistribution.reduce(
      (sum, count) => sum + count,
      0,
    );
    return total > 0
      ? (feedbackData.ratingDistribution[starIndex] / total) * 100
      : 0;
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Course Feedback & Reviews
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Student ratings and feedback analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Overview */}
        <div className="space-y-4">
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-3xl font-bold text-black dark:text-white">
                {feedbackData.averageRating}
              </span>
              <div className="flex">
                {renderStars(Math.floor(feedbackData.averageRating))}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {feedbackData.totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rating Distribution
            </h4>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {star}★
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${getRatingPercentage(star - 1)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {feedbackData.ratingDistribution[star - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Feedback
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {feedbackData.topFeedback.map((feedback, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-black dark:text-white">
                      {feedback.student}
                    </span>
                  </div>
                  <div className="flex">{renderStars(feedback.rating)}</div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  "{feedback.comment}"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Course: {feedback.course}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">92% Positive</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">3 Needs Attention</span>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            View All Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFeedbackWidget;
