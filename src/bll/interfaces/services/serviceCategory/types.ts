export interface ICreateServiceCategory {
  name: string;
}

export interface IUpdateServiceCategory {
  name?: string;
}

export interface IServiceCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
