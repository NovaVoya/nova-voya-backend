import { Injectable } from '@nestjs/common';
import { IServiceService } from '../interfaces/services/service';
import {
  ICreateService,
  IService,
  IUpdateService,
} from '../interfaces/services/service/types';
import ServiceRepository from 'src/dal/repositories/service';

@Injectable()
export default class ServiceService implements IServiceService {
  constructor(private readonly serviceRepo: ServiceRepository) {}

  async createService(service: ICreateService): Promise<IService> {
    return this.serviceRepo.createService(service);
  }
  async getServiceById(id: string): Promise<IService | null> {
    return this.serviceRepo.getServiceById(id);
  }
  async getServices(keyword?: string): Promise<IService[]> {
    return this.serviceRepo.getServices(keyword);
  }
  async updateService(
    id: string,
    service: IUpdateService,
  ): Promise<IService | null> {
    return this.serviceRepo.updateService(id, service);
  }
  async deleteService(id: string): Promise<void> {
    return this.serviceRepo.deleteService(id);
  }
}
