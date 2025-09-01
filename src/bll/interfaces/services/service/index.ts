import { ICreateService, IUpdateService, IService } from './types';

export interface IServiceService {
  createService(service: ICreateService): Promise<IService>;
  getServiceById(id: string): Promise<IService | null>;
  getServices(keyword?: string): Promise<IService[]>;
  updateService(id: string, service: IUpdateService): Promise<IService | null>;
  deleteService(id: string): Promise<void>;
}
