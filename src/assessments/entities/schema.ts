import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssessmentDocument = Assessment & Document;

@Schema()
export class Assessment {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: Number, ref: 'Module' })
  module_id: number;

  @Prop()
  title: string;

  @Prop()
  type: string;

  @Prop()
  max_score: number;

  @Prop({ type: Number, ref: 'Content' })
  content_id: number;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
