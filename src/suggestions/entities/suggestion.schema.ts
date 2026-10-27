import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SuggestionDocument = Suggestion & Document;

@Schema({ timestamps: true })
export class Suggestion {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, index: true })
  user_id: number;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  user_email: string;

  @Prop({ required: true, default: 'Sugerencia general' })
  category: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'pending' })
  status: string; // 'pending' | 'reviewed'

  @Prop({ default: Date.now })
  created_at: Date;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
