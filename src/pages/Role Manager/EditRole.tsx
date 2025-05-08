import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Permission from '@/interfaces/Permission';
import Role from '@/interfaces/Roles';
import { PencilIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';
import { useUserStore } from '@/store/useUserStore';

const EditRole = ({
  role,
  permissions,
  refreshPage,
}: {
  role: Role;
  permissions: Permission[];
  refreshPage: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const { toast } = useToast();

  // Get updateRolePermissions function from user store
  const updateRolePermissions = useUserStore(
    (state) => state.updateRolePermissions,
  );

  const handleUpdateRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const permId = parseInt(e.target.id);

    if (e.target.checked) {
      // Add permission if checked and not already in array
      if (!selectedPerms.includes(permId)) {
        setSelectedPerms([...selectedPerms, permId]);
      }
    } else {
      // Remove permission if unchecked
      setSelectedPerms(selectedPerms.filter((id) => id !== permId));
    }
  };

  const updateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Update the role permissions in our store
      updateRolePermissions(role.id, selectedPerms);

      toast({
        title: 'Permissions updated successfully',
      });

      refreshPage();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to update permissions',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PencilIcon className="h-4 w-4 cursor-pointer hover:text-primary" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update permissions for {role.name}</DialogTitle>
        <form onSubmit={updateRole}>
          {/* Course Name */}
          {permissions.map((perm) => (
            <div key={perm.id} className="flex items-center gap-3 mt-1 ">
              <input
                type="checkbox"
                name="permission"
                id={perm.id.toString()}
                className="h-4 w-4"
                onChange={handleUpdateRole}
              />
              <label htmlFor={perm.id.toString()}>{perm.name}</label>
            </div>
          ))}
          <DialogFooter>
            <div className="mb-5">
              <input
                type="submit"
                value="Submit"
                className="w-full font-medium cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRole;
