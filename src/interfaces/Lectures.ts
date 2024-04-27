export interface Lectures {
  id: number;
  course_id: number;
  module_id: number;
  prefix: string;
  name: string;
  file_id: number;
  is_trial: boolean;
  created_at: Date;
  updated_at: Date;
}
