export interface ICreateJob {
  title: string;
  description: string;
  website: string;
  link: string;
  category: string;
}

export interface IUpdateJob {
  title?: string;
  description?: string;
  website?: string;
  link?: string;
  category?: string;
}

export interface IJob {
  id: string;
  title: string;
  description: string;
  website: string;
  link: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
