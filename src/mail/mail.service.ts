import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Test Email',
      text: 'This is a test email',
      html: '<b>This is a test email</b>',
    });
  }
}