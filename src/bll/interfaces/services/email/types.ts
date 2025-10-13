export interface ISendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export interface IEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
