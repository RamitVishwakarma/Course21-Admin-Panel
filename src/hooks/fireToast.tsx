import toast from 'react-hot-toast';

/**
 * Toast notification utility for Course21 Admin Panel
 * Provides consistent styled toast notifications throughout the application
 */

// Define types for better type safety
interface ToastType {
  SUCCESS: string;
  WARNING: string;
  ERROR: string;
}

const TOAST_TYPES: ToastType = {
  SUCCESS: '0',
  WARNING: '1',
  ERROR: '2',
};

/**
 * Creates a custom styled toast notification
 * @param title - The title of the toast
 * @param msg - The message content
 * @param type - The type of toast (success, warning, error)
 */
const createToast = (title: string, msg: string, type: string) => {
  toast.custom((t) => (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'}
      max-w-md w-full ${
        type === TOAST_TYPES.SUCCESS
          ? 'bg-[#04b20c]'
          : type === TOAST_TYPES.WARNING
          ? 'bg-[#eab90f]'
          : 'bg-[#e13f32]'
      } shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4 ">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="mt-1 text-sm text-white">{msg}</p>
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => toast.dismiss(t.id)}
          type="button"
          className="mr-2 box-content rounded-none border-none opacity-100 hover:no-underline hover:opacity-50 focus:opacity-50 focus:shadow-none focus:outline-none text-white"
          data-te-toast-dismiss
          aria-label="Close"
        >
          <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  ));
};

/**
 * FireToast - A comprehensive toast notification system for Course21 Admin Panel
 *
 * Usage examples:
 * - fireToast.success('Success', 'Operation completed successfully!')
 * - fireToast.courseCreated('React Fundamentals')
 * - fireToast.userEnrolled('John Doe', 'JavaScript Basics')
 * - fireToast.custom('Custom Title', 'Custom message', 'warning')
 */
// Simple toast utility functions for common use cases
const fireToast = {
  success: (title: string, message: string) => {
    createToast(title, message, TOAST_TYPES.SUCCESS);
  },

  warning: (title: string, message: string) => {
    createToast(title, message, TOAST_TYPES.WARNING);
  },

  error: (title: string, message: string) => {
    createToast(title, message, TOAST_TYPES.ERROR);
  },

  // Course-specific toast notifications
  courseCreated: (courseName: string) => {
    createToast(
      'Course Created',
      `${courseName} has been successfully created!`,
      TOAST_TYPES.SUCCESS,
    );
  },

  courseUpdated: (courseName: string) => {
    createToast(
      'Course Updated',
      `${courseName} has been successfully updated!`,
      TOAST_TYPES.SUCCESS,
    );
  },

  courseDeleted: (courseName: string) => {
    createToast(
      'Course Deleted',
      `${courseName} has been deleted!`,
      TOAST_TYPES.WARNING,
    );
  },

  userEnrolled: (userName: string, courseName: string) => {
    createToast(
      'User Enrolled',
      `${userName} has been enrolled in ${courseName}!`,
      TOAST_TYPES.SUCCESS,
    );
  },

  userCreated: (userName: string) => {
    createToast(
      'User Created',
      `${userName} has been successfully created!`,
      TOAST_TYPES.SUCCESS,
    );
  },

  userUpdated: (userName: string) => {
    createToast(
      'User Updated',
      `${userName} profile has been updated!`,
      TOAST_TYPES.SUCCESS,
    );
  },

  // Data management toasts
  dataBackupCreated: () => {
    createToast(
      'Backup Created',
      'Data backup has been successfully created!',
      TOAST_TYPES.SUCCESS,
    );
  },

  dataRestored: () => {
    createToast(
      'Data Restored',
      'Data has been successfully restored from backup!',
      TOAST_TYPES.SUCCESS,
    );
  },

  dataIntegrityCheck: (errors: number) => {
    if (errors === 0) {
      createToast(
        'Integrity Check',
        'All data is valid and consistent!',
        TOAST_TYPES.SUCCESS,
      );
    } else {
      createToast(
        'Integrity Issues',
        `Found ${errors} data integrity issues!`,
        TOAST_TYPES.WARNING,
      );
    }
  },

  // Authentication and permission toasts
  loginSuccess: (userName: string) => {
    createToast(
      'Welcome Back',
      `Welcome back, ${userName}!`,
      TOAST_TYPES.SUCCESS,
    );
  },

  logoutSuccess: () => {
    createToast(
      'Logged Out',
      'You have been successfully logged out!',
      TOAST_TYPES.SUCCESS,
    );
  },

  permissionDenied: () => {
    createToast(
      'Permission Denied',
      'You do not have permission to perform this action!',
      TOAST_TYPES.ERROR,
    );
  },

  // System toasts
  networkError: () => {
    createToast(
      'Network Error',
      'Please check your internet connection and try again!',
      TOAST_TYPES.ERROR,
    );
  },

  saveSuccess: () => {
    createToast(
      'Saved',
      'Changes have been saved successfully!',
      TOAST_TYPES.SUCCESS,
    );
  },

  deleteConfirmation: (itemName: string) => {
    createToast(
      'Deleted',
      `${itemName} has been deleted successfully!`,
      TOAST_TYPES.WARNING,
    );
  },

  // Custom toast for any use case
  custom: (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error',
  ) => {
    const toastType =
      type === 'success'
        ? TOAST_TYPES.SUCCESS
        : type === 'warning'
        ? TOAST_TYPES.WARNING
        : TOAST_TYPES.ERROR;
    createToast(title, message, toastType);
  },
};

export default fireToast;
