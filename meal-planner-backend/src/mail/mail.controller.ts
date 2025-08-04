import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-test')
  async sendTestEmail(@Query('to') to: string) {
    if (!to) {
      return 'Bitte Empfänger als Query-Parameter angeben, z.B. ?to=dein.email@example.com';
    }
    await this.mailService.sendTestEmail(to);
    return `Test-Mail an ${to} wurde verschickt!`;
  }
}
