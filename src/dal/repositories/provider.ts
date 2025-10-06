import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProviderRepository } from 'src/bll/interfaces/repositories/provider';
import {
  ICreateProvider,
  IProvider,
  IUpdateProvider,
} from 'src/bll/interfaces/repositories/provider/types';
import { Provider, ProviderDocument } from 'src/dal/schemas/provider.schema';

@Injectable()
export default class ProviderRepository implements IProviderRepository {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
  ) {}

  async createProvider(provider: ICreateProvider): Promise<IProvider> {
    const createdProvider = await this.providerModel.create(provider);
    return {
      id: (createdProvider._id as string).toString(),
      description: createdProvider.description,
      name: createdProvider.name,
      type: createdProvider.type,
      address: createdProvider.address,
      phone: createdProvider.phone,
      email: createdProvider.email,
      city: createdProvider.city,
      country: createdProvider.country,
      latitude: createdProvider.latitude,
      longitude: createdProvider.longitude,
      reviewsCount: createdProvider.reviewsCount,
      overallRate: createdProvider.overallRate,
      thumbnail: createdProvider.thumbnail,
      gallery: createdProvider.gallery,
      faqProvider: createdProvider.faqProvider,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (createdProvider as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (createdProvider as any).updatedAt,
    };
  }
  async getProviderById(id: string): Promise<IProvider | null> {
    const provider = await this.providerModel.findById(id).exec();
    if (!provider) return null;
    return {
      id: (provider._id as string).toString(),
      description: provider.description,
      name: provider.name,
      type: provider.type,
      address: provider.address,
      phone: provider.phone,
      email: provider.email,
      city: provider.city,
      country: provider.country,
      latitude: provider.latitude,
      longitude: provider.longitude,
      reviewsCount: provider.reviewsCount,
      overallRate: provider.overallRate,
      thumbnail: provider.thumbnail,
      gallery: provider.gallery,
      faqProvider: provider.faqProvider,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (provider as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (provider as any).updatedAt,
    };
  }
  async getProviders(): Promise<IProvider[]> {
    const providers = await this.providerModel.find().exec();
    if (!providers) return [];
    return providers.map((provider) => {
      return {
        id: (provider._id as string).toString(),
        description: provider.description,
        name: provider.name,
        type: provider.type,
        address: provider.address,
        phone: provider.phone,
        email: provider.email,
        city: provider.city,
        country: provider.country,
        latitude: provider.latitude,
        longitude: provider.longitude,
        reviewsCount: provider.reviewsCount,
        overallRate: provider.overallRate,
        thumbnail: provider.thumbnail,
        gallery: provider.gallery,
        faqProvider: provider.faqProvider,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        createdAt: (provider as any).createdAt,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (provider as any).updatedAt,
      };
    });
  }
  async updateProvider(
    id: string,
    provider: IUpdateProvider,
  ): Promise<IProvider | null> {
    const _provider = await this.providerModel.findById(id).exec();
    if (!_provider) return null;

    const updatedProvider = await this.providerModel
      .findByIdAndUpdate(id, provider, { new: true })
      .exec();

    if (updatedProvider) {
      return {
        id: (updatedProvider._id as string).toString(),
        description: updatedProvider.description,
        name: updatedProvider.name,
        type: updatedProvider.type,
        address: updatedProvider.address,
        phone: updatedProvider.phone,
        email: updatedProvider.email,
        city: updatedProvider.city,
        country: updatedProvider.country,
        latitude: updatedProvider.latitude,
        longitude: updatedProvider.longitude,
        reviewsCount: updatedProvider.reviewsCount,
        overallRate: updatedProvider.overallRate,
        thumbnail: updatedProvider.thumbnail,
        gallery: updatedProvider.gallery,
        faqProvider: updatedProvider.faqProvider,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        createdAt: (updatedProvider as any).createdAt,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (updatedProvider as any).updatedAt,
      };
    }

    return null;
  }

  async deleteProvider(id: string): Promise<void> {
    await this.providerModel.findByIdAndDelete(id).exec();
  }
}
