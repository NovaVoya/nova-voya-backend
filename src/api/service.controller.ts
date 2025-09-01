import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import ServiceService from 'src/bll/services/service';
import { Response } from 'src/types/response';
import {
  ICreateService,
  IService,
  IUpdateService,
} from 'src/bll/interfaces/services/service/types';
import ProviderService from 'src/bll/services/provider';

@Controller('services')
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly providerService: ProviderService,
  ) {}

  @Get()
  async getServices(
    @Query('keyword') keyword: string,
  ): Promise<Response<IService[]>> {
    const services = await this.serviceService.getServices(keyword);

    return {
      data: services,
      message: 'Services fetched successfully',
      success: true,
    };
  }

  @Get(':id')
  async getService(
    @Param('id') id: string,
  ): Promise<Response<IService | null>> {
    const service = await this.serviceService.getServiceById(id);

    if (!service) {
      return {
        data: null,
        message: 'Service not found',
        success: false,
      };
    }

    return {
      data: service,
      message: 'Service fetched successfully',
      success: true,
    };
  }

  @Post()
  async createService(
    @Body() data: ICreateService,
  ): Promise<Response<IService | null>> {
    const service = await this.serviceService.createService(data);
    if (!service) {
      return {
        data: null,
        message: 'Service not created',
        success: false,
      };
    }

    return {
      data: service,
      message: 'Service created successfully',
      success: true,
    };
  }

  @Put(':id')
  async updateService(
    @Body() data: IUpdateService,
    @Param('id') id: string,
  ): Promise<Response<IService | null>> {
    const service = await this.serviceService.updateService(id, data);
    if (!service) {
      return {
        data: null,
        message: 'Service not updated',
        success: false,
      };
    }

    return {
      data: service,
      message: 'Service updated successfully',
      success: true,
    };
  }

  @Delete(':id')
  async deleteService(
    @Param('id') id: string,
  ): Promise<Response<IService | null>> {
    const service = await this.serviceService.getServiceById(id);
    if (!service) {
      return {
        data: null,
        message: 'Service not deleted',
        success: false,
      };
    }

    await this.serviceService.deleteService(id);

    return {
      data: service,
      message: 'Service deleted successfully',
      success: true,
    };
  }
}
