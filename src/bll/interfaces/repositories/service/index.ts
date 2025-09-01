import { ICreateService, IService, IUpdateService } from './types';

export interface IServiceRepository {
  createService(service: ICreateService): Promise<IService>;
  getServiceById(id: string): Promise<IService | null>;
  getServices(keyword?: string): Promise<IService[]>;
  updateService(id: string, service: IUpdateService): Promise<IService | null>;
  deleteService(id: string): Promise<void>;
}
