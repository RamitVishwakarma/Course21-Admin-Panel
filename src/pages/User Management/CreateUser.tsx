import React from 'react';
import { IdentificationIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { useToast } from '@/components/ui/use-toast';
import { AtSymbolIcon, KeyIcon, UserIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '@/store/useUserStore';

export default function CreateUser({
  refreshPage,
}: {
  refreshPage: () => void;
}) {
  interface FormData {
    name: string;
    username: string;
    email: string;
    password: string;
  }

  const [data, setData] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  // dialog state
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { addUser } = useUserStore();

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Add the user to our store
      addUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        status: 1,
        verified: 0,
        roles_mask: 0,
        role_id: 1, // Default role
        created_at: null,
        updated_at: null,
        deleted_at: null,
      });

      toast({
        title: 'User Added Successfully!',
      });
      //   // Default values, would be updated by the SelectRole component
      //   role_id: 0,
      //   role_name: '',
      // });

      toast({
        title: 'User Added Successfully (Emergency Mode)',
      });

      // Reset form fields
      setData({
        name: '',
        username: '',
        email: '',
        password: '',
      });

      refreshPage();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'User Addition Failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className=" inline-flex items-center justify-center gap-2.5 rounded-full bg-meta-3 py-4 px-6 text-center font-medium text-white hover:bg-opacity-80 lg:px-4 xl:px-6">
          <PlusCircleIcon className="h-5 w-5" />
          <span>Create User</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create User</DialogTitle>
        <form onSubmit={formSubmitHandler}>
          {/* User Name */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleFormData}
                placeholder="Enter Name"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <UserIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>
          {/* Username */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={data.username}
                onChange={handleFormData}
                placeholder="Enter Username"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <IdentificationIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleFormData}
                placeholder="Enter Email"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <AtSymbolIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>
          {/* Password */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleFormData}
                placeholder="Enter Password"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <KeyIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>
          {/* Note: Role will be set to default (1) and can be changed later */}
          <div className="mb-4.5">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role will be set to default and can be updated after creation.
            </p>
          </div>

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
}
