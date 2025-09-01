import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceCategory } from './serviceCategory.schema';
import { Provider } from './provider.schema';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  recommended: boolean;

  @Prop({ required: true })
  cancellation: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: ServiceCategory.name }],
    default: [],
  })
  categories: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: Provider.name,
    required: true,
  })
  provider: Types.ObjectId;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: [] })
  faq: {
    title: string;
    description: string;
  }[];

  @Prop()
  thumbnail: string;

  @Prop()
  gallery: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
