export interface Lectures {
  id: number;
  course_id: number;
  module_id: number;
  prefix: string;
  video_file: string;
  name: string;
  file_id: number;
  is_trial: boolean;
  image_path: string;
  created_at: Date;
  updated_at: Date;
}
