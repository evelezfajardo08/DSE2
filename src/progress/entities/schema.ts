import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema()
export class Progress {
  @Prop({ required: false, unique: true })
  id?: number;

  @Prop({ type: Number, ref: 'User', required: true })
  user_id: number;

  @Prop({ type: Number, ref: 'Module', default: 1 })
  module_id: number;

  @Prop()
  user_email?: string;

  @Prop()
  activity_id?: string;

  @Prop({ default: 0 })
  percentage: number;

  @Prop({ default: 'not_started' })
  status: string;

  @Prop({ default: Date.now })
  completed_at?: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
