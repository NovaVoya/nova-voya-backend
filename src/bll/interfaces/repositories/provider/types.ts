export interface ICreateProvider {
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'medical-center' | 'other';
  description: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  reviewsCount: number;
  overallRate: number;
  thumbnail: string;
  gallery: string[];
  faqProvider: {
    title: string;
    description: string;
  }[];
}

export interface IUpdateProvider {
  name?: string;
  type?: 'hospital' | 'clinic' | 'pharmacy' | 'medical-center' | 'other';
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  reviewsCount?: number;
  overallRate?: number;
  thumbnail?: string;
  gallery?: string[];
  faqProvider?: {
    title: string;
    description: string;
  }[];
}

export interface IProvider {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'medical-center' | 'other';
  description: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  reviewsCount: number;
  overallRate: number;
  thumbnail: string;
  gallery: string[];
  faqProvider: {
    title: string;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
