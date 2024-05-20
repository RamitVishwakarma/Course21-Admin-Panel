import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Role from '../../interfaces/Roles';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface RoleProps {
  roles: Role[];
  selected_option: string;
  userId: number;
  refreshPage: () => void;
}

export function SelectRole({
  roles,
  selected_option,
  userId,
  refreshPage,
}: RoleProps) {
  const [selectedOption, setSelectedOption] = useState<string>(selected_option);
  const { toast } = useToast();

  const handleValueChange = (value: string) => {
    setSelectedOption(value);
    const selectedRole = roles.find((role) => role.name === value);
    changeRole(selectedRole?.id);
  };

  const changeRole = (roleId: number | undefined) => {
    if (roleId !== undefined) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}users/${userId}/update`, {
          role_id: roleId,
        })
        .then((res) => {
          toast({
            title: 'Role Updated Successfully!',
          });
          console.log(res);
          refreshPage();
        })
        .catch((err) => {
          toast({
            title: 'Something Went Wrong!',
            variant: 'destructive',
          });
          console.log(err);
        });
    } else {
      toast({
        title: 'Something Went Wrong!',
        variant: 'destructive',
      });
    }
  };
  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="min-w-[120px]">
        <SelectValue placeholder={selectedOption} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a Role</SelectLabel>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.name}>
              {role.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
