import { ICreateProvider, IUpdateProvider, IProvider } from './types';

export interface IProviderService {
  createProvider(provider: ICreateProvider): Promise<IProvider>;
  getProviderById(id: string): Promise<IProvider | null>;
  getProviders(): Promise<IProvider[]>;
  updateProvider(
    id: string,
    provider: IUpdateProvider,
  ): Promise<IProvider | null>;
  deleteProvider(id: string): Promise<void>;
}
