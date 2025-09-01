import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJobRepository } from 'src/bll/interfaces/repositories/job';
import {
  ICreateJob,
  IJob,
  IUpdateJob,
} from 'src/bll/interfaces/repositories/job/types';
import { Job, JobDocument } from 'src/dal/schemas/job.schema';

@Injectable()
export default class JobRepository implements IJobRepository {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async createJob(job: ICreateJob): Promise<IJob> {
    const createdJob = await this.jobModel.create(job);
    return {
      id: (createdJob._id as string).toString(),
      title: createdJob.title,
      description: createdJob.description,
      website: createdJob.website,
      link: createdJob.link,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (createdJob as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (createdJob as any).updatedAt,
      category: createdJob.category,
    };
  }
  async getJobById(id: string): Promise<IJob | null> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) return null;
    return {
      id: (job._id as string).toString(),
      title: job.title,
      description: job.description,
      website: job.website,
      link: job.link,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      createdAt: (job as any).createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (job as any).updatedAt,
      category: job.category,
    };
  }
  async getJobs(): Promise<IJob[]> {
    const jobs = await this.jobModel.find().exec();
    return jobs.map((job) => {
      return {
        id: (job._id as string).toString(),
        title: job.title,
        description: job.description,
        website: job.website,
        link: job.link,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        createdAt: (job as any).createdAt,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (job as any).updatedAt,
        category: job.category,
      };
    });
  }
  async updateJob(id: string, job: IUpdateJob): Promise<IJob | null> {
    const _job = await this.jobModel.findById(id).exec();
    if (!_job) return null;

    const updatedJob = await this.jobModel
      .findByIdAndUpdate(id, job, { new: true })
      .exec();

    if (updatedJob) {
      return {
        id: (updatedJob._id as string).toString(),
        title: updatedJob.title,
        description: updatedJob.description,
        website: updatedJob.website,
        link: updatedJob.link,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        createdAt: (updatedJob as any).createdAt,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (updatedJob as any).updatedAt,
        category: updatedJob.category,
      };
    }

    return null;
  }

  async deleteJob(id: string): Promise<void> {
    await this.jobModel.findByIdAndDelete(id).exec();
  }
}
