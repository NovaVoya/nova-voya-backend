import { Injectable } from '@nestjs/common';
import { IServiceCategoryService } from '../interfaces/services/serviceCategory';
import {
  ICreateServiceCategory,
  IServiceCategory,
  IUpdateServiceCategory,
} from '../interfaces/services/serviceCategory/types';
import ServiceCategoryRepository from 'src/dal/repositories/serviceCategory';

@Injectable()
export default class ServiceCategoryService implements IServiceCategoryService {
  constructor(
    private readonly serviceCategoryRepo: ServiceCategoryRepository,
  ) {}

  async createServiceCategory(
    serviceCategory: ICreateServiceCategory,
  ): Promise<IServiceCategory> {
    return this.serviceCategoryRepo.createServiceCategory(serviceCategory);
  }
  async getServiceCategoryById(id: string): Promise<IServiceCategory | null> {
    return this.serviceCategoryRepo.getServiceCategoryById(id);
  }
  async getServiceCategories(): Promise<IServiceCategory[]> {
    return this.serviceCategoryRepo.getServiceCategories();
  }
  async updateServiceCategory(
    id: string,
    serviceCategory: IUpdateServiceCategory,
  ): Promise<IServiceCategory | null> {
    return this.serviceCategoryRepo.updateServiceCategory(id, serviceCategory);
  }
  async deleteServiceCategory(id: string): Promise<void> {
    return this.serviceCategoryRepo.deleteServiceCategory(id);
  }
}
