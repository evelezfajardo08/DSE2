import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: Number, ref: 'User' })
  user_id: number;

  @Prop({ type: Number, ref: 'Bot' })
  bot_id: number;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
