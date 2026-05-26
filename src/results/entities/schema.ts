import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema()
export class Result {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: Number, ref: 'User' })
  user_id: number;

  @Prop({ type: Number, ref: 'Assessment' })
  evaluation_id: number;

  @Prop()
  score: number;

  @Prop()
  evaluation_date: Date;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
