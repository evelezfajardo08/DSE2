import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema()
export class Module {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  level: string;

  @Prop()
  status: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
