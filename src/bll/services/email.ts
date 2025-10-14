/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { IEmailService } from '../interfaces/services/email';
import {
  ISendEmailOptions,
  IEmailResponse,
} from '../interfaces/services/email/types';
import * as fs from 'fs';
import * as path from 'path';

interface TransporterConfig {
  // service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string | undefined;
    pass: string | undefined;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
}

interface EmailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface AdvancedEmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
  replyTo?: string;
  fromName?: string;
}

interface PatientInquiryEmailData {
  short_id: string;
  Deal_title: string;
  provider_name: string;
  request_date: string;
  name: string;
  email: string;
  phone_e164: string;
  message: string;
}

@Injectable()
export default class EmailService implements IEmailService {
  private transporter: any = null;
  private isInitialized = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      const config: TransporterConfig = {
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER || 'example@novavoya.com',
          pass: process.env.GMAIL_PASS || 'xxxxxxxxxxxxxxxx',
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      this.transporter = nodemailer.createTransport(config);
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error);
      this.isInitialized = false;
    }
  }

  async sendEmail(options: ISendEmailOptions): Promise<IEmailResponse> {
    try {
      if (!this.isInitialized || !this.transporter) {
        return {
          success: false,
          error: 'Email transporter not initialized',
        };
      }

      const mailOptions: EmailOptions = {
        from: process.env.GMAIL_USER || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info?.messageId || 'unknown',
      };
    } catch (error: unknown) {
      console.error('❌ Error sending email:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const emailError = error as {
          code: string;
          responseCode?: number;
          message?: string;
        };

        if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
          console.error(
            '💡 Authentication Error: You must use Gmail App Password!',
          );
        } else if (
          emailError.code === 'ESOCKET' ||
          emailError.code === 'ECONNRESET'
        ) {
          console.error(
            '💡 Connection Error: This usually means wrong password or no App Password',
          );
        }
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async sendAdvancedEmail(
    options: AdvancedEmailOptions,
  ): Promise<IEmailResponse> {
    try {
      if (!this.isInitialized || !this.transporter) {
        return {
          success: false,
          error: 'Email transporter not initialized',
        };
      }

      const mailOptions = {
        from: `${options.fromName || 'Novavoya Support'} <${process.env.GMAIL_USER || process.env.SMTP_USER}>`,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
        replyTo: options.replyTo,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info?.messageId || 'unknown',
      };
    } catch (error: unknown) {
      console.error('❌ Error sending advanced email:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const emailError = error as {
          code: string;
          responseCode?: number;
          message?: string;
        };

        if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
          console.error(
            '💡 Authentication Error: You must use Gmail App Password!',
          );
        } else if (
          emailError.code === 'ESOCKET' ||
          emailError.code === 'ECONNRESET'
        ) {
          console.error(
            '💡 Connection Error: This usually means wrong password or no App Password',
          );
        }
      }
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private replaceTemplateVariables(
    template: string,
    data: Record<string, string>,
  ): string {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    }
    return result;
  }

  private async loadHtmlTemplate(templatePath: string): Promise<string> {
    try {
      const fullPath = path.resolve(templatePath);
      return await fs.promises.readFile(fullPath, 'utf-8');
    } catch (error) {
      console.error('❌ Error loading HTML template:', error);
      throw new Error(`Failed to load template: ${templatePath}`);
    }
  }

  async sendPatientInquiryEmail(
    to: string,
    data: PatientInquiryEmailData,
  ): Promise<IEmailResponse> {
    try {
      if (!this.isInitialized || !this.transporter) {
        return {
          success: false,
          error: 'Email transporter not initialized',
        };
      }

      // Load HTML template
      const templatePath = path.join(
        process.cwd(),
        'uploads/public/Nova_Voya_New_Patient_Inquiry_Email_Template.html',
      );
      const htmlTemplate = await this.loadHtmlTemplate(templatePath);

      // Replace template variables
      const htmlContent = this.replaceTemplateVariables(
        htmlTemplate,
        data as unknown as Record<string, string>,
      );

      // Prepare logo attachment
      const logoPath = path.join(process.cwd(), 'uploads/public/Logo.png');
      const mailOptions = {
        from: `Nova Voya Support <${
          process.env.GMAIL_USER || 'support@novavoya.com'
        }>`,
        to: to,
        subject: `New Patient Inquiry for ${data.Deal_title} (Ref: ${data.short_id})`,
        html: htmlContent,
        attachments: [
          {
            filename: 'Logo.png',
            path: logoPath,
            cid: 'Logo.png', // Content-ID for inline embedding
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info?.messageId || 'unknown',
      };
    } catch (error: unknown) {
      console.error('❌ Error sending patient inquiry email:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
