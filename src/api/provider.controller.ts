import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import ProviderService from 'src/bll/services/provider';
import { Response } from 'src/types/response';
import {
  ICreateProvider,
  IProvider,
  IUpdateProvider,
} from 'src/bll/interfaces/services/provider/types';
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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'gallery', maxCount: 10 }, // adjust as needed
      ],
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        storage: diskStorage({
          destination: (req, file, cb) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const dir = file.fieldname === 'thumbnail' ? thumbDir : galleryDir;
            ensureDir(dir);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  async createProvider(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() data: ICreateProvider,
  ): Promise<Response<IProvider | null>> {
    const thumbnailPath = files?.thumbnail?.[0]?.path ?? null;

    const galleryPaths = (files?.gallery ?? []).map((f) => f.path);

    // Persist paths with the provider (adjust to your schema)
    const provider = await this.providerService.createProvider({
      ...data,

      thumbnail: thumbnailPath!,

      gallery: galleryPaths,
    });

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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'gallery', maxCount: 10 }, // adjust as needed
      ],
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        storage: diskStorage({
          destination: (req, file, cb) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const dir = file.fieldname === 'thumbnail' ? thumbDir : galleryDir;
            ensureDir(dir);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  async updateProvider(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Body() data: IUpdateProvider,
    @Param('id') id: string,
  ): Promise<Response<IProvider | null>> {
    const thumbnailPath = files?.thumbnail?.[0]?.path ?? null;
    const galleryPaths = (files?.gallery ?? []).map((f) => f.path);

    // Persist paths with the provider (adjust to your schema)
    const provider = await this.providerService.updateProvider(id, {
      ...data,

      thumbnail: thumbnailPath!,
      gallery: galleryPaths,
    });

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
