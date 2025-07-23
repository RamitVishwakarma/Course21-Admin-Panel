export interface Role {
  id: number;
  name: string;
  code: string;
}

const rolesData: Role[] = [
  {
    id: 1,
    name: 'Admin',
    code: 'admin',
  },
  {
    id: 2,
    name: 'Student',
    code: 'student',
  },
];

export default rolesData;
