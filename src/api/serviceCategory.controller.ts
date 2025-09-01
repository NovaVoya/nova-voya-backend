import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Response } from 'src/types/response';
import {
  ICreateServiceCategory,
  IUpdateServiceCategory,
  IServiceCategory,
} from 'src/bll/interfaces/services/serviceCategory/types';
import ServiceCategoryService from 'src/bll/services/serviceCategory';

@Controller('serviceCategories')
export class ServiceCategoryController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @Get()
  async getServiceCategories(): Promise<Response<IServiceCategory[]>> {
    const serviceCategories =
      await this.serviceCategoryService.getServiceCategories();

    return {
      data: serviceCategories,
      message: 'Service categories fetched successfully',
      success: true,
    };
  }

  @Post()
  async createServiceCategory(
    @Body() data: ICreateServiceCategory,
  ): Promise<Response<IServiceCategory | null>> {
    const serviceCategory =
      await this.serviceCategoryService.createServiceCategory(data);
    if (!serviceCategory) {
      return {
        data: null,
        message: 'Service category not created',
        success: false,
      };
    }

    return {
      data: serviceCategory,
      message: 'Service category created successfully',
      success: true,
    };
  }

  @Put(':id')
  async updateServiceCategory(
    @Body() data: IUpdateServiceCategory,
    @Param('id') id: string,
  ): Promise<Response<IServiceCategory | null>> {
    const serviceCategory =
      await this.serviceCategoryService.updateServiceCategory(id, data);
    if (!serviceCategory) {
      return {
        data: null,
        message: 'Service category not updated',
        success: false,
      };
    }

    return {
      data: serviceCategory,
      message: 'Service category updated successfully',
      success: true,
    };
  }

  @Delete(':id')
  async deleteServiceCategory(
    @Param('id') id: string,
  ): Promise<Response<IServiceCategory | null>> {
    const serviceCategory =
      await this.serviceCategoryService.getServiceCategoryById(id);
    if (!serviceCategory) {
      return {
        data: null,
        message: 'Service category not deleted',
        success: false,
      };
    }

    await this.serviceCategoryService.deleteServiceCategory(id);

    return {
      data: serviceCategory,
      message: 'Service category deleted successfully',
      success: true,
    };
  }
}
