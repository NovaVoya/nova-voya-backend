import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Job, JobSchema } from './dal/schemas/job.schema';
import JobService from './bll/services/job';
import JobRepository from './dal/repositories/job';
import { JobController } from './api/job.controller';
import { Provider, ProviderSchema } from './dal/schemas/provider.schema';
import { Service, ServiceSchema } from './dal/schemas/service.schema';
import { ProviderController } from './api/provider.controller';
import { ServiceController } from './api/service.controller';
import ProviderRepository from './dal/repositories/provider';
import ProviderService from './bll/services/provider';
import ServiceRepository from './dal/repositories/service';
import ServiceService from './bll/services/service';
import { ServiceCategoryController } from './api/serviceCategory.controller';
import ServiceCategoryService from './bll/services/serviceCategory';
import ServiceCategoryRepository from './dal/repositories/serviceCategory';
import {
  ServiceCategory,
  ServiceCategorySchema,
} from './dal/schemas/serviceCategory.schema';
import { MainController } from './api/main.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Provider.name, schema: ProviderSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceCategory.name, schema: ServiceCategorySchema },
    ]),
  ],
  controllers: [
    AppController,
    JobController,
    ProviderController,
    ServiceController,
    ServiceCategoryController,
    MainController,
  ],
  providers: [
    AppService,
    JobRepository,
    JobService,
    ProviderRepository,
    ProviderService,
    ServiceRepository,
    ServiceService,
    ServiceCategoryRepository,
    ServiceCategoryService,
  ],
})
export class AppModule {}
