import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema()
export class Progress {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: Number, ref: 'User' })
  user_id: number;

  @Prop({ type: Number, ref: 'Module' })
  module_id: number;

  @Prop()
  percentage: number;

  @Prop()
  status: string;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
