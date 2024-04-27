import { Modules } from './Modules';

export interface Course {
  id: number;
  prefix: string | null;
  name: string;
  validity: number | null;
  manager: string | null;
  price: number;
  image_path: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  modules: Modules[];
}
