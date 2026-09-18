export class CreateMessageDto {
  id: number;
  conversation_id: number;
  sender: string;
  content: string;
  sent_at?: Date;
}
