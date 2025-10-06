import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import ServiceService from 'src/bll/services/service';
import { Response } from 'src/types/response';
import {
  ICreateService,
  IService,
  IUpdateService,
} from 'src/bll/interfaces/services/service/types';
import ProviderService from 'src/bll/services/provider';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function filenameFactory(req: any, file: Express.Multer.File, cb: Function) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cb(null, `${file.fieldname}-${unique}${extname(file.originalname)}`);
}

const uploadRoot = join(process.cwd(), 'uploads');
const thumbDir = join(uploadRoot, 'providers', 'thumbnails');
const galleryDir = join(uploadRoot, 'providers', 'gallery');

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'gallery', maxCount: 10 }, // adjust as needed
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const dir = file.fieldname === 'thumbnail' ? thumbDir : galleryDir;
            ensureDir(dir);
            cb(null, dir);
          },
          filename: filenameFactory,
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.startsWith('image/')) {
            return cb(
              new BadRequestException('Only image files are allowed'),
              false,
            );
          }
          cb(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB per file (tweak to your needs)
          files: 11, // 1 thumb + up to 10 gallery images
        },
      },
    ),
  )
  async createService(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() data: ICreateService,
  ): Promise<Response<IService | null>> {
    const thumbnailPath = files?.thumbnail?.[0]?.path ?? null;
    const galleryPaths = (files?.gallery ?? []).map((f) => f.path);

    const service = await this.serviceService.createService({
      ...data,
      thumbnail: thumbnailPath!,
      gallery: galleryPaths,
    });

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'gallery', maxCount: 10 }, // adjust as needed
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const dir = file.fieldname === 'thumbnail' ? thumbDir : galleryDir;
            ensureDir(dir);
            cb(null, dir);
          },
          filename: filenameFactory,
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.startsWith('image/')) {
            return cb(
              new BadRequestException('Only image files are allowed'),
              false,
            );
          }
          cb(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB per file (tweak to your needs)
          files: 11, // 1 thumb + up to 10 gallery images
        },
      },
    ),
  )
  async updateService(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() data: IUpdateService,
    @Param('id') id: string,
  ): Promise<Response<IService | null>> {
    const thumbnailPath = files?.thumbnail?.[0]?.path ?? null;
    const galleryPaths = (files?.gallery ?? []).map((f) => f.path);

    const updateObject = {
      ...data,
    };

    if (thumbnailPath) updateObject.thumbnail = thumbnailPath;
    if (galleryPaths) updateObject.gallery = galleryPaths;

    const service = await this.serviceService.updateService(id, {
      ...updateObject,
    });

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
