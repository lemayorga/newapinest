import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MailOptions } from "./mail-body.model";
import { SentMessageInfo } from "nodemailer";

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}


    async sendEmail(mailOptions: MailOptions): Promise<SentMessageInfo | boolean> {
      try{
          return await this.mailerService.sendMail(mailOptions);
      } catch (ex: any) {
          Logger.error(ex);
          return false;
      }
    }
}

// https://notiz.dev/blog/send-emails-with-nestjs#install-dependencies
// https://handlebarsjs.com/installation/#npm-or-yarn-recommended