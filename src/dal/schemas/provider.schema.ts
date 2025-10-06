import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProviderDocument = Provider & Document;

@Schema({ timestamps: true })
export class Provider {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: 'hospital' | 'clinic' | 'pharmacy' | 'medical-center' | 'other';

  @Prop()
  description: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  reviewsCount: number;

  @Prop()
  overallRate: number;

  @Prop()
  thumbnail: string;

  @Prop({ required: true, default: 'provider' })
  username: string;

  @Prop({ required: true, default: '12345678' })
  password: string;

  @Prop({ required: true, default: 0 })
  totalServicesView: number;

  @Prop()
  gallery: string[];

  @Prop({ default: [] })
  faqs: {
    title: string;
    description: string;
  }[];
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
