import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import ServiceService from 'src/bll/services/service';
import { Response } from 'src/types/response';
import * as crypto from 'crypto';
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
import {
  ProviderReviews,
  ProviderReviewsDocument,
} from 'src/dal/schemas/providerReviews.schema';
import { Provider } from 'src/dal/schemas/provider.schema';

@Controller('main')
export class MainController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly providerService: ProviderService,
    private readonly serviceCategoryService: ServiceCategoryService,
    @InjectModel(BookRequest.name)
    private bookRequestModel: Model<BookRequestDocument>,
    @InjectModel(ProviderReviews.name)
    private providerReviewsModel: Model<ProviderReviewsDocument>,
    @InjectModel(Provider.name)
    private providerModel: Model<Provider>,
  ) {}

  @Get()
  async get(): Promise<
    Response<{
      providers: {
        id: string;
        name: string;
        type: string;
        city: string;
        country: string;
        image: string;
        isComingSoon: boolean;
      }[];
      recommendedServices: {
        id: string;
        name: string;
        price: string;
        provider: string;
        providerName: string;
        image: string;
        rate: number;
        reviewsCount: number;
        discount: string;
        validDiscountDate: Date;
        location: string;
      }[];
      services: {
        id: string;
        name: string;
        price: string;
        provider: string;
        providerName: string;
        image: string;
        rate: number;
        reviewsCount: number;
        discount: string;
        validDiscountDate: Date;
        location: string;
      }[];
    }>
  > {
    const services = await this.serviceService.getServices();
    const providers = await this.providerService.getProviders();

    const data: {
      providers: {
        id: string;
        name: string;
        type: string;
        city: string;
        country: string;
        image: string;
        isComingSoon: boolean;
      }[];
      recommendedServices: {
        id: string;
        name: string;
        price: string;
        provider: string;
        providerName: string;
        image: string;
        rate: number;
        reviewsCount: number;
        discount: string;
        validDiscountDate: Date;
        location: string;
      }[];
      services: {
        id: string;
        name: string;
        price: string;
        provider: string;
        providerName: string;
        image: string;
        rate: number;
        reviewsCount: number;
        discount: string;
        validDiscountDate: Date;
        location: string;
      }[];
    } = {
      providers: providers.map((i) => {
        return {
          id: i.id,
          name: i.name,
          type: i.type,
          city: i.city,
          country: i.country,
          image: i.gallery[0],
          isComingSoon: i.isComingSoon,
        };
      }),
      recommendedServices: services
        .filter(
          (i) =>
            providers.find((p) => p.id === i.provider.toString()) &&
            i.recommended,
        )
        .map((i) => {
          return {
            id: i.id.toString(),
            name: i.name,
            providerName: providers.find((p) => p.id === i.provider.toString())!
              .name,
            provider: i.provider.toString(),
            price: i.price,
            image: i.thumbnail,
            rate: i.rate,
            reviewsCount: i.reviewsCount,
            discount: i.discount,
            validDiscountDate: i.validDiscountDate,
            location: i.location,
          };
        }),
      services: services
        .filter((i) => providers.find((p) => p.id === i.provider.toString()))
        .map((i) => {
          return {
            id: i.id.toString(),
            name: i.name,
            providerName: providers.find((p) => p.id === i.provider.toString())!
              .name,
            provider: i.provider.toString(),
            price: i.price,
            image: i.thumbnail,

            rate: i.rate,
            reviewsCount: i.reviewsCount,
            discount: i.discount,
            validDiscountDate: i.validDiscountDate,
            location: i.location,
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
  ): Promise<
    Response<
      (IService & {
        providerName: string;
      })[]
    >
  > {
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
          faqsProvider: {
            title: string;
            description: string;
          }[];
          relatedServices: {
            id: string;
            name: string;
            price: string;
            provider: string;
            recommended: boolean;
            providerName: string;
            image: string;
            rate: number;
            reviewsCount: number;
            discount: string;
            validDiscountDate: Date;
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

    await this.providerModel.findOneAndUpdate(
      { id: provider.id },
      { $inc: { totalServicesView: 1 } },
    );

    const relatedServices: (
      | (IService & { providerName: string })
      | undefined
    )[] = services
      .filter(
        (i) =>
          i.provider && i.provider.toString() === service.provider.toString(),
      )
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
        faqsProvider: provider.faqs,
        relatedServices: relatedServices
          .filter((relatedService) => relatedService !== undefined)
          .filter((rs) => rs.id.toString() !== service.id.toString())
          .map((i) => ({
            id: i.id.toString(),
            name: i.name,
            price: i.price,
            discount: i.discount,
            recommended: i.recommended,
            providerName: i.providerName,
            image: i.gallery[0],
            rate: i.rate,
            provider: i.provider.toString(),
            reviewsCount: i.reviewsCount,
            validDiscountDate: i.validDiscountDate,
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
      thumbnail: string;
      createdAt: Date;
      updatedAt: Date;
      reviews: {
        name: string;
        description: string;
        rate: number;
        gender: 'male' | 'female';
        createdAt: Date;
        updatedAt: Date;
      }[];
      bookRequests: {
        name: string;
        phoneNumber: string;
        email: string;
        description: string;
        provider: string;
        service: string;
      }[];
    } | null>
  > {
    const provider = await this.providerService.getProviderById(id);
    const services = await this.serviceService.getServices();

    const bookRequests = await this.bookRequestModel.find({
      provider: id,
    });

    if (!provider) {
      return {
        data: null,
        message: 'Provider not found',
        success: false,
      };
    }
    await this.providerReviewsModel.deleteMany({});

    const providerReviews = await this.providerReviewsModel.find({
      // provider: new Types.ObjectId(id),
      // displayInWebsite: true,
    });

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
        reviews: providerReviews.map((i) => ({
          ...i,
          gender: i.gender,
          description: i.description,
          name: i.name,
          rate: i.rate,
          // @ts-expect-error createdAt is not typed on mongoose doc
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
          createdAt: i.createdAt.toISOString(),
          // @ts-expect-error updatedAt is not typed on mongoose doc
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
          updatedAt: i.updatedAt.toISOString(),
        })),
        bookRequests: bookRequests.map((i) => ({
          name: i.name,
          phoneNumber: i.phoneNumber,
          email: i.email,
          description: i.description,
          provider: i.provider.toString(),
          service: i.service.toString(),
          serviceName: services.find(
            (item) => item.id.toString() === i.service.toString(),
          )?.name,
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

  @Post('login')
  async login(
    @Body()
    loginDto: {
      id: string;
      username: string;
      password: string;
    },
  ) {
    const provider = await this.providerModel.findById(loginDto.id);
    if (!provider) {
      return {
        data: { message: '' },
        message: 'Provider not found or invalid credentials',
        success: false,
      };
    }

    if (provider.username !== loginDto.username) {
      return {
        data: { message: '' },
        message: 'Provider not found or invalid credentials',
        success: false,
      };
    }

    if (provider.password !== loginDto.password) {
      return {
        data: { message: '' },
        message: 'Provider not found or invalid credentials',
        success: false,
      };
    }

    // Generate random token with id inside
    const randomPart = crypto.randomBytes(16).toString('hex');
    const token = `${randomPart}${loginDto.id}${randomPart}`;

    return {
      data: { token },
      message: 'Login successful',
      success: true,
    };
  }
}
