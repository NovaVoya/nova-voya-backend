import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  website: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: false })
  category: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
