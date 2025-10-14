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
    console.log('📧 Initializing EmailService...');
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      console.log('⚙️ Setting up email transporter configuration...');
      const config: TransporterConfig = {
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
      console.log('✅ Email transporter initialized successfully.');
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error);
      this.isInitialized = false;
    }
  }

  async sendEmail(options: ISendEmailOptions): Promise<IEmailResponse> {
    console.log('📤 Attempting to send email...', options);

    try {
      if (!this.isInitialized || !this.transporter) {
        console.warn('⚠️ Email transporter not initialized.');
        return { success: false, error: 'Email transporter not initialized' };
      }

      const mailOptions: EmailOptions = {
        from: process.env.GMAIL_USER || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      console.log('📨 Sending email with options:', mailOptions);

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info);

      return { success: true, messageId: info?.messageId || 'unknown' };
    } catch (error: unknown) {
      console.error('❌ Error sending email:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const emailError = error as {
          code: string;
          responseCode?: number;
          message?: string;
        };
        console.warn('⚠️ Email error details:', emailError);

        if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
          console.error(
            '💡 Authentication Error: You must use Gmail App Password!',
          );
        } else if (
          emailError.code === 'ESOCKET' ||
          emailError.code === 'ECONNRESET'
        ) {
          console.error(
            '💡 Connection Error: Possibly wrong password or missing App Password.',
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
    console.log('📤 Attempting to send advanced email...', options);

    try {
      if (!this.isInitialized || !this.transporter) {
        console.warn('⚠️ Email transporter not initialized.');
        return { success: false, error: 'Email transporter not initialized' };
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

      console.log('📨 Sending advanced email with options:', mailOptions);

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Advanced email sent successfully:', info);

      return { success: true, messageId: info?.messageId || 'unknown' };
    } catch (error: unknown) {
      console.error('❌ Error sending advanced email:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const emailError = error as {
          code: string;
          responseCode?: number;
          message?: string;
        };
        console.warn('⚠️ Email error details:', emailError);

        if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
          console.error(
            '💡 Authentication Error: You must use Gmail App Password!',
          );
        } else if (
          emailError.code === 'ESOCKET' ||
          emailError.code === 'ECONNRESET'
        ) {
          console.error(
            '💡 Connection Error: Possibly wrong password or missing App Password.',
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
    console.log('🧩 Replacing template variables...');
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    }
    console.log('✅ Template variables replaced.');
    return result;
  }

  private async loadHtmlTemplate(templatePath: string): Promise<string> {
    try {
      console.log('📁 Loading HTML template from path:', templatePath);
      const fullPath = path.resolve(templatePath);
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      console.log('✅ Template loaded successfully.');
      return content;
    } catch (error) {
      console.error('❌ Error loading HTML template:', error);
      throw new Error(`Failed to load template: ${templatePath}`);
    }
  }

  async sendPatientInquiryEmail(
    to: string,
    data: PatientInquiryEmailData,
  ): Promise<IEmailResponse> {
    console.log(
      '📬 Preparing to send patient inquiry email to:',
      to,
      'with data:',
      data,
    );

    try {
      if (!this.isInitialized || !this.transporter) {
        console.warn('⚠️ Email transporter not initialized.');
        return { success: false, error: 'Email transporter not initialized' };
      }

      const templatePath = path.join(
        process.cwd(),
        'uploads/public/Nova_Voya_New_Patient_Inquiry_Email_Template.html',
      );
      const htmlTemplate = await this.loadHtmlTemplate(templatePath);

      const htmlContent = this.replaceTemplateVariables(
        htmlTemplate,
        data as unknown as Record<string, string>,
      );

      const logoPath = path.join(process.cwd(), 'uploads/public/Logo.png');
      const mailOptions = {
        from: `Nova Voya Support <${process.env.GMAIL_USER || 'support@novavoya.com'}>`,
        to,
        subject: `New Patient Inquiry for ${data.Deal_title} (Ref: ${data.short_id})`,
        html: htmlContent,
        attachments: [
          {
            filename: 'Logo.png',
            path: logoPath,
            cid: 'Logo.png',
          },
        ],
      };

      console.log(
        '📨 Sending patient inquiry email with options:',
        mailOptions,
      );

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Patient inquiry email sent successfully:', info);

      return { success: true, messageId: info?.messageId || 'unknown' };
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
