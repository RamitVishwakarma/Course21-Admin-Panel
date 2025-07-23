import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import EnhancedForm from '../../components/EnhancedForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import EnhancedButton from '../../components/EnhancedButton';
import { courseValidationSchema } from '../../utils/validation';

const DemoShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // Demo data for form
  const courseFormFields = [
    {
      name: 'title',
      label: 'Course Title',
      type: 'text' as const,
      placeholder: 'Enter course title',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter course description',
      required: true,
    },
    {
      name: 'price',
      label: 'Price (₹)',
      type: 'number' as const,
      placeholder: '0',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Programming', value: 'programming' },
        { label: 'Data Science', value: 'data-science' },
        { label: 'Web Development', value: 'web-development' },
        { label: 'Mobile Development', value: 'mobile-development' },
        { label: 'DevOps', value: 'devops' },
      ],
    },
    {
      name: 'level',
      label: 'Difficulty Level',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
  ];

  const handleCourseSubmit = async (data: Record<string, any>) => {
    // Simulate API call
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    console.log('Course data:', data);
    // This would normally save to the store
  };

  const handleLoadingDemo = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
    showSuccess('Loading completed successfully!');
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
          🎉 Enhanced Features Showcase
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Demonstrating the new enhanced components: Toast notifications,
          Loading states, Form validation, and Quick actions menu.
        </p>
      </div>

      {/* Toast Notifications Demo */}
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
          📢 Toast Notifications
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EnhancedButton
            variant="success"
            onClick={() => showSuccess('Operation completed successfully!')}
          >
            Success Toast
          </EnhancedButton>
          <EnhancedButton
            variant="danger"
            onClick={() => showError('Something went wrong!')}
          >
            Error Toast
          </EnhancedButton>
          <EnhancedButton
            variant="secondary"
            onClick={() => showWarning('Please check your input!')}
          >
            Warning Toast
          </EnhancedButton>
          <EnhancedButton
            variant="outline"
            onClick={() => showInfo('Here is some useful information!')}
          >
            Info Toast
          </EnhancedButton>
        </div>
      </div>

      {/* Loading States Demo */}
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
          ⏳ Loading States
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
            <LoadingSpinner size="xl" />
          </div>

          <div className="flex space-x-4">
            <EnhancedButton
              variant="primary"
              loading={isLoading}
              loadingText="Processing..."
              onClick={handleLoadingDemo}
            >
              {isLoading ? 'Loading...' : 'Start Loading Demo'}
            </EnhancedButton>

            <EnhancedButton
              variant="outline"
              loading={isLoading}
              disabled={!isLoading}
            >
              Disabled Button
            </EnhancedButton>
          </div>

          {isLoading && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <LoadingSpinner size="sm" color="primary" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Demo processing in progress...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Form Demo */}
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
          📝 Enhanced Form with Validation
        </h2>
        <EnhancedForm
          title="Create New Course Demo"
          fields={courseFormFields}
          validationSchema={courseValidationSchema}
          onSubmit={handleCourseSubmit}
          submitText="Create Course"
          onCancel={() => showInfo('Form cancelled')}
          className="max-w-2xl"
        />
      </div>

      {/* Quick Actions Info */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">🚀 Quick Actions Menu</h2>
        <p className="text-blue-100">
          Look for the floating action button (FAB) in the bottom-right corner!
          Click it to access quick actions for creating courses, managing users,
          viewing analytics, and more.
        </p>
      </div>

      {/* Full Screen Loading Demo */}
      {isLoading && (
        <LoadingSpinner
          fullScreen
          size="xl"
          text="Processing demo... Please wait"
          color="primary"
        />
      )}
    </div>
  );
};

export default DemoShowcase;
