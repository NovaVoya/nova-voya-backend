import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import JobService from 'src/bll/services/job';
import { Response } from 'src/types/response';
import {
  ICreateJob,
  IJob,
  IUpdateJob,
} from 'src/bll/interfaces/services/job/types';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getJobs(): Promise<Response<IJob[]>> {
    const jobs = await this.jobService.getJobs();

    return {
      data: jobs,
      message: 'Jobs fetched successfully',
      success: true,
    };
  }

  @Post()
  async createJob(@Body() data: ICreateJob): Promise<Response<IJob | null>> {
    const job = await this.jobService.createJob(data);
    if (!job) {
      return {
        data: null,
        message: 'Job not created',
        success: false,
      };
    }

    return {
      data: job,
      message: 'Job created successfully',
      success: true,
    };
  }

  @Put(':id')
  async updateJob(
    @Body() data: IUpdateJob,
    @Param('id') id: string,
  ): Promise<Response<IJob | null>> {
    const job = await this.jobService.updateJob(id, data);
    if (!job) {
      return {
        data: null,
        message: 'Job not updated',
        success: false,
      };
    }

    return {
      data: job,
      message: 'Job updated successfully',
      success: true,
    };
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string): Promise<Response<IJob | null>> {
    const job = await this.jobService.getJobById(id);
    if (!job) {
      return {
        data: null,
        message: 'Job not deleted',
        success: false,
      };
    }

    await this.jobService.deleteJob(id);

    return {
      data: job,
      message: 'Job deleted successfully',
      success: true,
    };
  }
}
