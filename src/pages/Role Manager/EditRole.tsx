import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Permission } from '@/types/Permission';
import { Role } from '@/types/Roles';
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
  const [selectedPerms, setSelectedPerms] = useState<string[]>(
    role.permissions || [],
  );
  const { toast } = useToast();
  const updateRole = useUserStore((state) => state.updateRole);

  // When dialog opens, sync selectedPerms with current role.permissions
  React.useEffect(() => {
    if (open) {
      setSelectedPerms(role.permissions || []);
    }
  }, [open, role.permissions]);

  const handleUpdateRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const permCode = e.target.id;
    if (e.target.checked) {
      if (!selectedPerms.includes(permCode)) {
        setSelectedPerms([...selectedPerms, permCode]);
      }
    } else {
      setSelectedPerms(selectedPerms.filter((code) => code !== permCode));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      updateRole(role.id, { permissions: selectedPerms } as Partial<Role>);
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
        <form onSubmit={handleSubmit}>
          {/* Course Name */}
          {permissions.map((perm) => (
            <div key={perm.id} className="flex items-center gap-3 mt-1 ">
              <input
                type="checkbox"
                name="permission"
                id={perm.code}
                className="h-4 w-4"
                checked={
                  selectedPerms.includes(perm.code) ||
                  selectedPerms.includes('*')
                }
                onChange={handleUpdateRole}
              />
              <label htmlFor={perm.code}>{perm.name}</label>
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
