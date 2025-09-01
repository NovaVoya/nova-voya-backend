import {
  ICreateServiceCategory,
  IServiceCategory,
  IUpdateServiceCategory,
} from './types';

export interface IServiceCategoryRepository {
  createServiceCategory(
    serviceCategory: ICreateServiceCategory,
  ): Promise<IServiceCategory>;
  getServiceCategoryById(id: string): Promise<IServiceCategory | null>;
  getServiceCategories(): Promise<IServiceCategory[]>;
  updateServiceCategory(
    id: string,
    serviceCategory: IUpdateServiceCategory,
  ): Promise<IServiceCategory | null>;
  deleteServiceCategory(id: string): Promise<void>;
}
