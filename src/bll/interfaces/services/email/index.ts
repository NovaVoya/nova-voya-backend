import { ISendEmailOptions, IEmailResponse } from './types';

export interface IEmailService {
  sendEmail(options: ISendEmailOptions): Promise<IEmailResponse>;
}
