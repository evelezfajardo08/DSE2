import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BotDocument = Bot & Document;

@Schema()
export class Bot {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  version: string;

  @Prop()
  description: string;

  @Prop()
  status: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
