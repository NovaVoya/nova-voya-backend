import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import ServiceService from 'src/bll/services/service';
import { Response } from 'src/types/response';
import ProviderService from 'src/bll/services/provider';
import ServiceCategoryService from 'src/bll/services/serviceCategory';
import { IService } from 'src/bll/interfaces/services/service/types';
import { IProvider } from 'src/bll/interfaces/services/provider/types';
import { InjectModel } from '@nestjs/mongoose';
import {
  BookRequest,
  BookRequestDocument,
} from 'src/dal/schemas/bookRequests.schema';
import { Model } from 'mongoose';

@Controller('main')
export class MainController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly providerService: ProviderService,
    private readonly serviceCategoryService: ServiceCategoryService,
    @InjectModel(BookRequest.name)
    private bookRequestModel: Model<BookRequestDocument>,
  ) {}

  @Get()
  async get(): Promise<
    Response<{
      categories: string[];
      providers: {
        name: string;
        type: string;
        city: string;
        country: string;
        image: string;
      }[];
      services: {
        name: string;
        recommended: boolean;
        provider: string;
        price: string;
        image: string;
      }[];
    }>
  > {
    const services = await this.serviceService.getServices();
    const providers = await this.providerService.getProviders();
    const serviceCategories =
      await this.serviceCategoryService.getServiceCategories();

    const data: {
      categories: string[];
      providers: {
        name: string;
        type: string;
        city: string;
        country: string;
        id: string;
        image: string;
      }[];
      services: {
        name: string;
        recommended: boolean;
        provider: string;
        price: string;
        image: string;
      }[];
    } = {
      categories: serviceCategories.map((i) => i.name),
      providers: providers.map((i) => {
        return {
          name: i.name,
          type: i.type,
          city: i.city,
          country: i.country,
          id: i.id,
          image: i.gallery[0],
        };
      }),
      services: services
        .filter((i) => providers.find((p) => p.id === i.provider.toString()))
        .map((i) => {
          return {
            id: i.id.toString(),
            name: i.name,
            recommended: i.recommended,
            provider: providers.find((p) => p.id === i.provider.toString())!
              .name,
            price: i.price,
            image: i.gallery[0],
          };
        }),
    };

    return {
      data: data,
      message: 'Data fetched successfully',
      success: true,
    };
  }

  @Get('services')
  async getServices(
    @Query('keyword') keyword: string,
    @Query('sort') sort: string,
    @Query('filter') filter: string,
  ): Promise<Response<(IService & { providerName: string })[]>> {
    const services = await this.serviceService.getServices(keyword);
    const providers = await this.providerService.getProviders();

    let data: ((IService & { providerName: string }) | undefined)[] = services
      .filter((i) => i.provider)
      .map((service) => {
        const provider = providers.find(
          (p) => p.id === service.provider.toString(),
        );

        if (!provider) return;

        return {
          ...service,
          providerName: provider.name,
        };
      });

    if (filter && filter === 'has_discount') {
      data = data.filter((i) => i !== undefined).filter((i) => i.discount);
    }

    if (filter && filter === 'is_package') {
      data = data
        .filter((i) => i !== undefined)
        .filter((i) => i.packageHighlights.length);
    }

    console.log(filter, sort);

    if (sort && sort === 'price:asc') {
      data = data
        .filter((i) => i !== undefined)
        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort && sort === 'price:desc') {
      data = data
        .filter((i) => i !== undefined)
        .sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return {
      data: data.filter((i) => i !== undefined),
      message: 'Services fetched successfully',
      success: true,
    };
  }

  @Get('services/:id')
  async getServiceById(@Param('id') id: string): Promise<
    Response<
      | (IService & {
          providerName: string;
          providerAbout: string;
          relatedServices: {
            id: string;
            name: string;
            price: string;
            recommended: boolean;
            providerName: string;
            image: string;
          }[];
        })
      | null
    >
  > {
    const service = await this.serviceService.getServiceById(id);
    const services = await this.serviceService.getServices();
    const providers = await this.providerService.getProviders();

    if (!service) {
      return {
        data: null,
        message: 'Service not found',
        success: false,
      };
    }

    const provider = await this.providerService.getProviderById(
      service.provider.toString(),
    );

    if (!provider) {
      return {
        data: null,
        message: 'Provider not found',
        success: false,
      };
    }

    const relatedServices: (
      | (IService & { providerName: string })
      | undefined
    )[] = services
      .filter((i) => i.provider)
      .map((service) => {
        const provider = providers.find(
          (p) => p.id === service.provider.toString(),
        );

        if (!provider) return;

        return {
          ...service,
          providerName: provider.name,
          image: service.gallery[0],
        };
      });

    return {
      data: {
        ...service,
        providerName: provider.name,
        providerAbout: provider.description,
        relatedServices: relatedServices
          .filter((relatedService) => relatedService !== undefined)
          .filter((rs) => rs.id.toString() !== service.id.toString())
          .map((i) => ({
            id: i.id.toString(),
            name: i.name,
            price: i.price,
            recommended: i.recommended,
            providerName: i.providerName,
            image: i.gallery[0],
          })),
      },
      message: 'Service fetched successfully',
      success: true,
    };
  }

  @Get('providers/:id')
  async getProviderById(@Param('id') id: string): Promise<
    Response<{
      id: string;
      name: string;
      description: string;
      overallRate: number;
      reviewsCount: number;
      type: string;
      services: {
        id: string;
        name: string;
        price: string;
        recommended: boolean;
        image: string;
      }[];
      latitude: number;
      longitude: number;
      address: string;
      city: string;
      country: string;
      gallery: string[];
      createdAt: Date;
      updatedAt: Date;
    } | null>
  > {
    const provider = await this.providerService.getProviderById(id);
    const services = await this.serviceService.getServices();

    if (!provider) {
      return {
        data: null,
        message: 'Provider not found',
        success: false,
      };
    }

    const providerServices = services.filter(
      (service) => service.provider.toString() === id,
    );

    return {
      data: {
        ...provider,
        services: providerServices.map((i) => ({
          ...i,
          image: i.gallery[0],
        })),
      },
      message: 'Providers fetched successfully',
      success: true,
    };
  }

  @Get('providers')
  async getProviders(): Promise<Response<IProvider[]>> {
    const providers = await this.providerService.getProviders();

    return {
      data: providers,
      message: 'Providers fetched successfully',
      success: true,
    };
  }

  @Post('book')
  async bookRequest(
    @Body()
    bookRequestDto: {
      providerId: string;
      serviceId: string;
      name: string;
      email: string;
      phoneNumber: string;
      description: string;
    },
  ): Promise<Response<{ message: string }>> {
    const services = await this.serviceService.getServices();
    const providers = await this.providerService.getProviders();

    if (!services || !providers) {
      return {
        data: { message: '' },
        message: 'No services or providers found',
        success: false,
      };
    }

    if (!services.length || !providers.length) {
      return {
        data: { message: '' },
        message: 'No services or providers found',
        success: false,
      };
    }

    const service = services.find(
      (i) => i.id.toString() === bookRequestDto.serviceId,
    );
    const provider = providers.find(
      (i) => i.id.toString() === bookRequestDto.providerId,
    );

    if (!service || !provider) {
      return {
        data: { message: '' },
        message: 'Invalid provider or service id',
        success: false,
      };
    }

    const createdBookRequest = await this.bookRequestModel.create({
      ...bookRequestDto,
      service: service.id,
      provider: provider.id,
    });

    if (!createdBookRequest) {
      return {
        data: { message: '' },
        message: 'Book request created successfully',
        success: false,
      };
    }

    return {
      data: { message: '' },
      message: 'Book request created successfully',
      success: true,
    };
  }
}
