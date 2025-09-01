import { Injectable } from '@nestjs/common';
import { IJobService } from '../interfaces/services/job';
import { ICreateJob, IJob, IUpdateJob } from '../interfaces/services/job/types';
import JobRepository from 'src/dal/repositories/job';

@Injectable()
export default class JobService implements IJobService {
  constructor(private readonly jobRepo: JobRepository) {}

  async createJob(job: ICreateJob): Promise<IJob> {
    return this.jobRepo.createJob(job);
  }
  async getJobById(id: string): Promise<IJob | null> {
    return this.jobRepo.getJobById(id);
  }
  async getJobs(): Promise<IJob[]> {
    return this.jobRepo.getJobs();
  }
  async updateJob(id: string, job: IUpdateJob): Promise<IJob | null> {
    return this.jobRepo.updateJob(id, job);
  }
  async deleteJob(id: string): Promise<void> {
    return this.jobRepo.deleteJob(id);
  }
}
