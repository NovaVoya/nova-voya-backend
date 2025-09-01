import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import ProviderService from 'src/bll/services/provider';
import { Response } from 'src/types/response';
import {
  ICreateProvider,
  IProvider,
  IUpdateProvider,
} from 'src/bll/interfaces/services/provider/types';

@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async getProviders(): Promise<Response<IProvider[]>> {
    const providers = await this.providerService.getProviders();

    return {
      data: providers,
      message: 'Providers fetched successfully',
      success: true,
    };
  }

  @Get(':id')
  async getProvider(
    @Param('id') id: string,
  ): Promise<Response<IProvider | null>> {
    const provider = await this.providerService.getProviderById(id);

    return {
      data: provider,
      message: 'Provider fetched successfully',
      success: true,
    };
  }

  @Post()
  async createProvider(
    @Body() data: ICreateProvider,
  ): Promise<Response<IProvider | null>> {
    const provider = await this.providerService.createProvider(data);
    if (!provider) {
      return {
        data: null,
        message: 'Provider not created',
        success: false,
      };
    }

    return {
      data: provider,
      message: 'Provider created successfully',
      success: true,
    };
  }

  @Put(':id')
  async updateProvider(
    @Body() data: IUpdateProvider,
    @Param('id') id: string,
  ): Promise<Response<IProvider | null>> {
    const provider = await this.providerService.updateProvider(id, data);
    if (!provider) {
      return {
        data: null,
        message: 'Provider not updated',
        success: false,
      };
    }

    return {
      data: provider,
      message: 'Provider updated successfully',
      success: true,
    };
  }

  @Delete(':id')
  async deleteProvider(
    @Param('id') id: string,
  ): Promise<Response<IProvider | null>> {
    const provider = await this.providerService.getProviderById(id);
    if (!provider) {
      return {
        data: null,
        message: 'Provider not deleted',
        success: false,
      };
    }

    await this.providerService.deleteProvider(id);

    return {
      data: provider,
      message: 'Provider deleted successfully',
      success: true,
    };
  }
}
