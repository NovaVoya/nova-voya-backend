import { Types } from 'mongoose';

export interface ICreateService {
  name: string;
  description: string;
  price: string;
  categories: Types.ObjectId[];
  provider: Types.ObjectId;
  recommended: boolean;
  cancellation: boolean;
  faq?: {
    title: string;
    description: string;
  }[];
  tags?: string[];
  thumbnail: string;
  gallery: string[];
}

export interface IUpdateService {
  name?: string;
  description?: string;
  price?: string;
  categories?: Types.ObjectId[];
  provider?: Types.ObjectId;
  recommended?: boolean;
  cancellation?: boolean;
  tags?: string[];
  faq?: {
    title: string;
    description: string;
  }[];
  thumbnail?: string;
  gallery?: string[];
}

export interface IService {
  id: string;
  name: string;
  description: string;
  price: string;
  categories: Types.ObjectId[];
  provider: Types.ObjectId;
  tags: string[];
  recommended: boolean;
  cancellation: boolean;
  faq?: {
    title: string;
    description: string;
  }[];
  thumbnail: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}
