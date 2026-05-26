export class CreateBotDto {
  id: number;
  name: string;
  version: string;
  description: string;
  status: string;
  created_at?: Date;
}
