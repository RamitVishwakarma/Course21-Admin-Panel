import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useCourseStore } from '../../store/useCourseStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  AcademicCapIcon,
  XMarkIcon,
  CheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

interface BulkOperationsProps {
  selectedUsers: string[];
  onClearSelection: () => void;
  refreshPage: () => void;
}

const BulkOperations = ({
  selectedUsers,
  onClearSelection,
  refreshPage,
}: BulkOperationsProps) => {
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();
  const { users, updateUser, deleteUser, enrollUserInCourse } = useUserStore();
  const { courses } = useCourseStore();

  const selectedUserObjects = users.filter((user) =>
    selectedUsers.includes(user.id),
  );

  const handleBulkEnroll = async () => {
    if (!selectedCourse || selectedUsers.length === 0) {
      toast({
        title: 'Please select a course and users',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Check which users are already enrolled
      const usersToEnroll = selectedUsers.filter((userId) => {
        const user = users.find((u) => u.id === userId);
        return !user?.enrolledCourses?.includes(selectedCourse);
      });

      if (usersToEnroll.length === 0) {
        toast({
          title: 'All selected users are already enrolled',
          description: 'No new enrollments needed',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Enroll each user in the selected course
      for (const userId of usersToEnroll) {
        await enrollUserInCourse(userId, selectedCourse);
      }

      const course = courses.find((c) => c.id === selectedCourse);
      const skipped = selectedUsers.length - usersToEnroll.length;

      toast({
        title: 'Bulk Enrollment Successful',
        description: `${
          usersToEnroll.length
        } users enrolled in "${course?.title}"${
          skipped > 0 ? ` (${skipped} already enrolled)` : ''
        }`,
      });

      setIsEnrollDialogOpen(false);
      setSelectedCourse('');
      onClearSelection();
      refreshPage();
    } catch (error) {
      toast({
        title: 'Enrollment Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    setIsProcessing(true);

    try {
      // Update all selected users
      for (const userId of selectedUsers) {
        updateUser(userId, { isActive });
      }

      toast({
        title: 'Status Updated',
        description: `${selectedUsers.length} users ${
          isActive ? 'activated' : 'deactivated'
        }`,
      });

      onClearSelection();
      refreshPage();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      // Delete all selected users
      for (const userId of selectedUsers) {
        deleteUser(userId);
      }

      toast({
        title: 'Users Deleted',
        description: `${selectedUsers.length} users removed successfully`,
      });

      onClearSelection();
      refreshPage();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <UsersIcon className="w-5 h-5 mr-2" />
            {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}{' '}
            Selected
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 w-8 p-0"
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Dialog
            open={isEnrollDialogOpen}
            onOpenChange={setIsEnrollDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <AcademicCapIcon className="w-4 h-4 mr-1" />
                Bulk Enroll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Course Enrollment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Enrolling {selectedUsers.length} users:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedUserObjects.slice(0, 5).map((user) => (
                      <Badge key={user.id} variant="outline">
                        {user.name || user.username}
                      </Badge>
                    ))}
                    {selectedUsers.length > 5 && (
                      <Badge variant="outline">
                        +{selectedUsers.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Select Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-black"
                  >
                    <option value="" className="text-black dark:text-white">
                      Choose a course...
                    </option>
                    {courses.map((course) => (
                      <option
                        key={course.id}
                        value={course.id}
                        className="text-black dark:text-white"
                      >
                        {course.title} - ₹{course.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEnrollDialogOpen(false);
                      setSelectedCourse('');
                    }}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkEnroll}
                    className="flex-1"
                    disabled={isProcessing || !selectedCourse}
                  >
                    {isProcessing ? 'Enrolling...' : 'Enroll Users'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkStatusUpdate(true)}
            disabled={isProcessing}
            className="flex items-center"
          >
            <CheckIcon className="w-4 h-4 mr-1" />
            Activate All
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkStatusUpdate(false)}
            disabled={isProcessing}
            className="flex items-center"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Deactivate All
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isProcessing}
            className="flex items-center"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Delete All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkOperations;
