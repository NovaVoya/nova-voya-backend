import { Injectable } from '@nestjs/common';
import { IProviderService } from '../interfaces/services/provider';
import {
  ICreateProvider,
  IProvider,
  IUpdateProvider,
} from '../interfaces/services/provider/types';
import ProviderRepository from 'src/dal/repositories/provider';

@Injectable()
export default class ProviderService implements IProviderService {
  constructor(private readonly providerRepo: ProviderRepository) {}

  async createProvider(provider: ICreateProvider): Promise<IProvider> {
    return this.providerRepo.createProvider(provider);
  }
  async getProviderById(id: string): Promise<IProvider | null> {
    return this.providerRepo.getProviderById(id);
  }
  async getProviders(): Promise<IProvider[]> {
    return this.providerRepo.getProviders();
  }
  async updateProvider(
    id: string,
    provider: IUpdateProvider,
  ): Promise<IProvider | null> {
    return this.providerRepo.updateProvider(id, provider);
  }
  async deleteProvider(id: string): Promise<void> {
    return this.providerRepo.deleteProvider(id);
  }
}
