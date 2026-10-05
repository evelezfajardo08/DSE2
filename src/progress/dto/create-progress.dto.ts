export class CreateProgressDto {
  id?: number | string;
  user_id: number;
  module_id?: number;
  user_email?: string;
  activity_id?: string;
  percentage?: number;
  status?: string;
  completed_at?: Date;
}
