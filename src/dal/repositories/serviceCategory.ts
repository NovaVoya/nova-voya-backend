import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ServiceCategory,
  ServiceCategoryDocument,
} from '../schemas/serviceCategory.schema';
import {
  ICreateServiceCategory,
  IServiceCategory,
  IUpdateServiceCategory,
} from 'src/bll/interfaces/repositories/serviceCategory/types';
import { IServiceCategoryRepository } from 'src/bll/interfaces/repositories/serviceCategory';

@Injectable()
export default class ServiceCategoryRepository
  implements IServiceCategoryRepository
{
  constructor(
    @InjectModel(ServiceCategory.name)
    private providerModel: Model<ServiceCategoryDocument>,
  ) {}

  async createServiceCategory(
    provider: ICreateServiceCategory,
  ): Promise<IServiceCategory> {
    const createdProvider = await this.providerModel.create(provider);
    return {
      id: (createdProvider._id as string).toString(),
      name: createdProvider.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (createdProvider as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (createdProvider as any).updatedAt,
    };
  }
  async getServiceCategoryById(id: string): Promise<IServiceCategory | null> {
    const provider = await this.providerModel.findById(id).exec();
    if (!provider) return null;
    return {
      id: (provider._id as string).toString(),
      name: provider.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (provider as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (provider as any).updatedAt,
    };
  }
  async getServiceCategories(): Promise<IServiceCategory[]> {
    const providers = await this.providerModel.find().exec();
    if (!providers) return [];
    return providers.map((provider) => {
      return {
        id: (provider._id as string).toString(),
        name: provider.name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        createdAt: (provider as any).createdAt,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (provider as any).updatedAt,
      };
    });
  }
  async updateServiceCategory(
    id: string,
    provider: IUpdateServiceCategory,
  ): Promise<IServiceCategory | null> {
    const _provider = await this.providerModel.findById(id).exec();
    if (!_provider) return null;

    const updatedProvider = await this.providerModel
      .findByIdAndUpdate(id, provider, { new: true })
      .exec();

    if (updatedProvider) {
      return {
        id: (updatedProvider._id as string).toString(),
        name: updatedProvider.name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        createdAt: (updatedProvider as any).createdAt,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (updatedProvider as any).updatedAt,
      };
    }

    return null;
  }

  async deleteServiceCategory(id: string): Promise<void> {
    await this.providerModel.findByIdAndDelete(id).exec();
  }
}
