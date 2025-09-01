import { ICreateJob, IJob, IUpdateJob } from './types';

export interface IJobRepository {
  createJob(job: ICreateJob): Promise<IJob>;
  getJobById(id: string): Promise<IJob | null>;
  getJobs(): Promise<IJob[]>;
  updateJob(id: string, job: IUpdateJob): Promise<IJob | null>;
  deleteJob(id: string): Promise<void>;
}
