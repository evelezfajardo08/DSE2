import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ActivityAttemptDocument = ActivityAttempt & Document;

@Schema({ timestamps: true })
export class ActivityAttempt {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, index: true })
  user_id: number;

  @Prop({ required: true })
  user_email: string;

  @Prop({ required: true, index: true })
  activity_id: string;

  @Prop({ required: true })
  skill: string;

  @Prop({ required: true })
  activity_title: string;

  @Prop({ required: true })
  response: string;

  @Prop({ type: Number, min: 0, max: 100, default: null })
  score: number | null;

  @Prop()
  feedback: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  rubric_scores: Array<Record<string, unknown>>;

  @Prop({ type: [String], default: [] })
  strengths: string[];

  @Prop({ type: [String], default: [] })
  next_steps: string[];

  @Prop({ type: [String], default: [] })
  sources: string[];

  @Prop({ default: 'evaluated' })
  status: 'evaluated' | 'pending_evaluation';

  @Prop({ default: Date.now })
  submitted_at: Date;
}

export const ActivityAttemptSchema = SchemaFactory.createForClass(ActivityAttempt);