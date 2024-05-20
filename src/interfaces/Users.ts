export default interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  username: string;
  status: number; //left
  verified: number; //left
  roles_mask: number; //left
  registered: number; //left
  role_id: number; // done
  last_login: number; //done
  created_at: Date; //left
  updated_at: Date; //left
  deleted_at: Date; //left
}
