import { Lectures } from './Lectures';

export interface Modules {
  id: number;
  name: string;
  sequence_id: number;
  course_id: number;
  image_path: string;
  lectures: Lectures[];
}
