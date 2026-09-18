export class CreateResultDto {
  id: number;
  user_id: number;
  evaluation_id: number;
  score: number;
  evaluation_date?: Date;
}
