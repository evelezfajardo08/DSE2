import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: Number, ref: 'Conversation' })
  conversation_id: number;

  @Prop()
  sender: string;

  @Prop()
  content: string;

  @Prop({ default: Date.now })
  sent_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
