import { Controller, Get, Param, Query } from '@nestjs/common';
import ServiceService from 'src/bll/services/service';
import { Response } from 'src/types/response';
import ProviderService from 'src/bll/services/provider';
import ServiceCategoryService from 'src/bll/services/serviceCategory';
import { IService } from 'src/bll/interfaces/services/service/types';
import { IProvider } from 'src/bll/interfaces/services/provider/types';

@Controller('main')
export class MainController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly providerService: ProviderService,
    private readonly serviceCategoryService: ServiceCategoryService,
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
  ): Promise<Response<(IService & { providerName: string })[]>> {
    const services = await this.serviceService.getServices(keyword);
    const providers = await this.providerService.getProviders();

    const data: ((IService & { providerName: string }) | undefined)[] = services
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
}
