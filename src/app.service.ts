import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail/mail.service';

@Injectable()
export class AppService {
  
  constructor(
    private readonly configService: ConfigService,
    private mailService: MailService
  ) {}

  getSecretKey(): string {
    return this.configService.get('AP_NAME'); // read environment variable
  }

  async sendEmail() {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    // ...
    // send confirmation mail
    // await this.mailService.sendUserConfirmation("jaleman@people-apps.com","ddd", token);

    const url = `example.com/auth/confirm?token=${token}`;
    const result = await this.mailService.sendEmail({
      to: [ 'jaleman@people-apps.com', 'jcarlosverde@gmail.com' ],
      template: './confirmation',
      context: { // ✏️ filling curly brackets with content
        name: "Juan",
        url,
      },
    });
    return result;
  }
}
