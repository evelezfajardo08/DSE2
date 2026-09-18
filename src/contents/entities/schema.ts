import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentDocument = Content & Document;

@Schema()
export class Content {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: Number, ref: 'Module' })
  module_id: number;

  @Prop()
  type: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  resource_url: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
