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

  @Prop({ required: false })
  discount: string;

  @Prop({ required: false })
  validDiscountDate: Date;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  recommended: boolean;

  @Prop({ required: true })
  cancellation: boolean;

  @Prop({ required: true })
  consultation: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: [] })
  packageHighlights: string[];

  @Prop({ required: true })
  clinicInformation: string;

  @Prop({ default: [] })
  highlights: string[];

  @Prop({ required: true })
  howItWorks: string;

  @Prop({ default: [] })
  included: string[];

  @Prop({ default: [] })
  excluded: string[];

  @Prop({ default: [] })
  expectedOutcome: string[];

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
  faqPackage: {
    title: string;
    description: string;
  }[];

  @Prop({ default: [] })
  faqProvider: {
    title: string;
    description: string;
  }[];

  @Prop({ default: [] })
  faqProcudures: {
    title: string;
    description: string;
  }[];

  @Prop()
  thumbnail: string;

  @Prop()
  gallery: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
