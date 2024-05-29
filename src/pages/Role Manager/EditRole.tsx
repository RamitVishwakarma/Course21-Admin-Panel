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
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const EditRole = ({
  role,
  permissions,
}: {
  role: Role;
  permissions: Permission[];
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const { toast } = useToast();
  const handleUpdateRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerms([...selectedPerms, parseInt(e.target.id)]);
  };

  const updateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}permissions/role/bulk-assign`,
        {
          role_id: role.id,
          permissions: selectedPerms,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('Authorization')}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setOpen(false);
        toast({
          title: 'Permissions updated successfully',
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Failed to update permissions',
          variant: 'destructive',
        });
      });
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
