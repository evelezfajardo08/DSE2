export class CreateProgressDto {
  id?: number | string;
  user_id: number;
  module_id?: number;
  user_email?: string;
  activity_id?: string;
  submodule_name?: string;
  exercise_response?: string;
  overall_progress?: number;
  percentage?: number;
  status?: string;
  completed_at?: Date;
}
