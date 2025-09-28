import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Provider } from './provider.schema';
import { Service } from './service.schema';

export type BookRequestDocument = BookRequest & Document;

@Schema({ timestamps: true })
export class BookRequest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: Provider.name,
    required: true,
  })
  provider: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Service.name,
    required: true,
  })
  service: Types.ObjectId;
}

export const BookRequestSchema = SchemaFactory.createForClass(BookRequest);
