import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IServiceRepository } from 'src/bll/interfaces/repositories/service';
import {
  ICreateService,
  IService,
  IUpdateService,
} from 'src/bll/interfaces/repositories/service/types';
import { Service, ServiceDocument } from 'src/dal/schemas/service.schema';

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export default class ServiceRepository implements IServiceRepository {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async createService(service: ICreateService): Promise<IService> {
    const createdService = await this.serviceModel.create(service);
    return {
      id: (createdService._id as string).toString(),
      name: createdService.name,
      description: createdService.description,
      price: createdService.price,
      discount: createdService.discount,
      validDiscountDate: createdService.validDiscountDate,
      rate: createdService.rate,
      recommended: createdService.recommended,
      cancellation: createdService.cancellation,
      consultation: createdService.consultation,
      duration: createdService.duration,
      location: createdService.location,
      packageHighlights: createdService.packageHighlights,
      clinicInformation: createdService.clinicInformation,
      highlights: createdService.highlights,
      howItWorks: createdService.howItWorks,
      included: createdService.included,
      excluded: createdService.excluded,
      expectedOutcome: createdService.expectedOutcome,
      faqPackage: createdService.faqPackage,
      faqProvider: createdService.faqProvider,
      faqProcudures: createdService.faqProcudures,
      categories: createdService.categories,
      provider: createdService.provider,
      thumbnail: createdService.thumbnail,
      gallery: createdService.gallery,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (createdService as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (createdService as any).updatedAt,
    };
  }
  async getServiceById(id: string): Promise<IService | null> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) return null;
    return {
      id: (service._id as string).toString(),
      name: service.name,
      description: service.description,
      price: service.price,
      discount: service.discount,
      validDiscountDate: service.validDiscountDate,
      rate: service.rate,
      recommended: service.recommended,
      cancellation: service.cancellation,
      consultation: service.consultation,
      duration: service.duration,
      location: service.location,
      packageHighlights: service.packageHighlights,
      clinicInformation: service.clinicInformation,
      highlights: service.highlights,
      howItWorks: service.howItWorks,
      included: service.included,
      excluded: service.excluded,
      expectedOutcome: service.expectedOutcome,
      faqPackage: service.faqPackage,
      faqProvider: service.faqProvider,
      faqProcudures: service.faqProcudures,
      categories: service.categories,
      provider: service.provider,
      thumbnail: service.thumbnail,
      gallery: service.gallery,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (service as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (service as any).updatedAt,
    };
  }
  async getServices(keyword?: string): Promise<IService[]> {
    const hasKeyword = typeof keyword === 'string' && keyword.trim() !== '';
    const filter: FilterQuery<any> = {};

    if (hasKeyword) {
      const k = keyword.trim();
      const rx = new RegExp(escapeRegex(k), 'i');

      // Text fields: case-insensitive contains
      const or: FilterQuery<any>[] = [{ name: rx }, { description: rx }];

      // Price: string "contains" match using $expr + $regexMatch (MongoDB 4.2+)
      or.push({
        $expr: {
          $regexMatch: {
            input: { $toString: '$price' },
            regex: escapeRegex(k),
            options: 'i',
          },
        },
      });

      filter.$or = or;
    }

    const services = await this.serviceModel.find(filter).exec();

    return services.map((service) => ({
      id: (service._id as string).toString(),
      name: service.name,
      description: service.description,
      price: service.price,
      discount: service.discount,
      validDiscountDate: service.validDiscountDate,
      rate: service.rate,
      recommended: service.recommended,
      cancellation: service.cancellation,
      consultation: service.consultation,
      duration: service.duration,
      location: service.location,
      packageHighlights: service.packageHighlights,
      clinicInformation: service.clinicInformation,
      highlights: service.highlights,
      howItWorks: service.howItWorks,
      included: service.included,
      excluded: service.excluded,
      expectedOutcome: service.expectedOutcome,
      faqPackage: service.faqPackage,
      faqProvider: service.faqProvider,
      faqProcudures: service.faqProcudures,
      categories: service.categories,
      provider: service.provider,
      thumbnail: service.thumbnail,
      gallery: service.gallery,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (service as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (service as any).updatedAt,
    }));
  }
  async updateService(
    id: string,
    service: IUpdateService,
  ): Promise<IService | null> {
    const _service = await this.serviceModel.findById(id).exec();
    if (!_service) return null;

    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, service, { new: true })
      .exec();

    if (updatedService) {
      return {
        id: (updatedService._id as string).toString(),
        name: updatedService.name,
        description: updatedService.description,
        price: updatedService.price,
        discount: updatedService.discount,
        validDiscountDate: updatedService.validDiscountDate,
        rate: updatedService.rate,
        recommended: updatedService.recommended,
        cancellation: updatedService.cancellation,
        consultation: updatedService.consultation,
        duration: updatedService.duration,
        location: updatedService.location,
        packageHighlights: updatedService.packageHighlights,
        clinicInformation: updatedService.clinicInformation,
        highlights: updatedService.highlights,
        howItWorks: updatedService.howItWorks,
        included: updatedService.included,
        excluded: updatedService.excluded,
        expectedOutcome: updatedService.expectedOutcome,
        faqPackage: updatedService.faqPackage,
        faqProvider: updatedService.faqProvider,
        faqProcudures: updatedService.faqProcudures,
        categories: updatedService.categories,
        provider: updatedService.provider,
        thumbnail: updatedService.thumbnail,
        gallery: updatedService.gallery,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        createdAt: (updatedService as any).createdAt,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (updatedService as any).updatedAt,
      };
    }

    return null;
  }

  async deleteService(id: string): Promise<void> {
    await this.serviceModel.findByIdAndDelete(id).exec();
  }
}
