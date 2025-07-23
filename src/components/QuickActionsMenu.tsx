import React, { useState } from 'react';
import {
  PlusIcon,
  UserPlusIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description: string;
}

const QuickActionsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { showInfo } = useToast();

  const quickActions: QuickAction[] = [
    {
      id: 'create-course',
      label: 'New Course',
      icon: AcademicCapIcon,
      path: '/admin/course/create',
      description: 'Create a new course',
    },
    {
      id: 'create-user',
      label: 'Add User',
      icon: UserPlusIcon,
      path: '/admin/user/create',
      description: 'Add a new user to the platform',
    },
    {
      id: 'view-analytics',
      label: 'Analytics',
      icon: ClipboardDocumentListIcon,
      path: '/admin/analytics',
      description: 'View detailed analytics dashboard',
    },
    {
      id: 'manage-courses',
      label: 'Manage Courses',
      icon: BookOpenIcon,
      path: '/admin/course',
      description: 'Manage all courses',
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    setIsOpen(false);
    showInfo(`Navigating to ${action.label}`);
    navigate(action.path);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Actions List */}
      {isOpen && (
        <div className="mb-4 space-y-2">
          {quickActions.map((action) => (
            <div
              key={action.id}
              onClick={() => handleActionClick(action)}
              className="group flex items-center space-x-3 bg-white dark:bg-boxdark rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer p-3 min-w-48"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black dark:text-white group-hover:text-primary transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-bodydark dark:text-bodydark2">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl 
          transition-all duration-200 flex items-center justify-center
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default QuickActionsMenu;
