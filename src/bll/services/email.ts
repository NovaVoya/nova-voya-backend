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

interface TransporterConfig {
  service: string;
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
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER || 'soroush@novavoya.com',
          pass: process.env.GMAIL_PASS || 'dfva hejp lpro omon',
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      this.transporter = nodemailer.createTransport(config);
      this.isInitialized = true;

      console.log('✅ Email transporter initialized successfully');
      console.log('📧 Using Gmail SMTP service');
      console.log(
        '💡 Make sure you are using Gmail App Password, not regular password',
      );
      console.log(
        '   Generate App Password: https://myaccount.google.com/apppasswords',
      );
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
          console.error(
            '   Generate App Password: https://myaccount.google.com/apppasswords',
          );
        } else if (
          emailError.code === 'ESOCKET' ||
          emailError.code === 'ECONNRESET'
        ) {
          console.error(
            '💡 Connection Error: This usually means wrong password or no App Password',
          );
          console.error(
            '   Make sure you are using App Password, not regular Gmail password',
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
          console.error(
            '   Generate App Password: https://myaccount.google.com/apppasswords',
          );
        } else if (
          emailError.code === 'ESOCKET' ||
          emailError.code === 'ECONNRESET'
        ) {
          console.error(
            '💡 Connection Error: This usually means wrong password or no App Password',
          );
          console.error(
            '   Make sure you are using App Password, not regular Gmail password',
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
}
