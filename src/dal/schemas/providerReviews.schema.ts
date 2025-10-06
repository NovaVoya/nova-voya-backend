import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Provider } from './provider.schema';

export type ProviderReviewsDocument = ProviderReviews & Document;

@Schema({ timestamps: true })
export class ProviderReviews {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: false })
  displayInWebsite: boolean;

  @Prop({ required: true })
  gender: 'male' | 'female';

  @Prop({ required: true })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: Provider.name,
    required: true,
  })
  provider: Types.ObjectId;

  @Prop({ required: true })
  rate: number;
}

export const ProviderReviewsSchema =
  SchemaFactory.createForClass(ProviderReviews);
