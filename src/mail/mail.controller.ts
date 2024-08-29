import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-test-email')
  async sendTestEmail(@Body('email') email: string) {
    await this.mailService.sendTestEmail(email);
    return { message: 'Test email sent' };
  }
}