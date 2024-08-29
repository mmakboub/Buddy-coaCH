import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        debug: true,
      },
      defaults: {
        from: '"No Reply" <noreply@BuddyCoach.com>',
      },
    //   template: {
    //     dir: join(__dirname, 'templates'),
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailerModule],
})
export class MailModule {}