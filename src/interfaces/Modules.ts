import { Lectures } from './Lectures';

export interface Modules {
  id: number;
  name: string;
  sequence_id: number;
  course_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
  delted_at: string;
  lectures?: Lectures[];
}
