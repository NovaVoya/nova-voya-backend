import { Types } from 'mongoose';

export interface ICreateService {
  name: string;
  description: string;
  price: string;
  discount: string;
  validDiscountDate: Date;
  rate: number;
  reviewsCount: number;
  recommended: boolean;
  cancellation: boolean;
  consultation: string;
  duration: string;
  location: string;
  packageHighlights: string[];
  clinicInformation: string;
  highlights: string[];
  howItWorks: string;
  included: string[];
  excluded: string[];
  expectedOutcome: string[];
  faqPackage: {
    title: string;
    description: string;
  }[];
  faqProcudures: {
    title: string;
    description: string;
  }[];
  categories: Types.ObjectId[];
  provider: Types.ObjectId;
  thumbnail: string;
  gallery: string[];
}

export interface IUpdateService {
  name?: string;
  description?: string;
  price?: string;
  discount?: string;
  validDiscountDate?: Date;
  rate?: number;
  reviewsCount?: number;
  recommended?: boolean;
  cancellation?: boolean;
  consultation?: string;
  duration?: string;
  location?: string;
  packageHighlights?: string[];
  clinicInformation?: string;
  highlights?: string[];
  howItWorks?: string;
  included?: string[];
  excluded?: string[];
  expectedOutcome?: string[];
  faqPackage?: {
    title: string;
    description: string;
  }[];
  faqProcudures?: {
    title: string;
    description: string;
  }[];
  categories?: Types.ObjectId[];
  provider?: Types.ObjectId;
  thumbnail?: string;
  gallery?: string[];
}

export interface IService {
  id: string;
  name: string;
  description: string;
  price: string;
  discount: string;
  validDiscountDate: Date;
  rate: number;
  reviewsCount: number;
  recommended: boolean;
  cancellation: boolean;
  consultation: string;
  duration: string;
  location: string;
  packageHighlights: string[];
  clinicInformation: string;
  highlights: string[];
  howItWorks: string;
  included: string[];
  excluded: string[];
  expectedOutcome: string[];
  faqPackage: {
    title: string;
    description: string;
  }[];
  faqProcudures: {
    title: string;
    description: string;
  }[];
  categories: Types.ObjectId[];
  provider: Types.ObjectId;
  thumbnail: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}
