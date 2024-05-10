import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MailOptions } from "./mail-body.model";
import { SentMessageInfo } from "nodemailer";

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    /**
     * Send email 
     * @mailOptions options with data about insert html email 
     * @return   Promise<SentMessageInfo | boolean> 
     */
    async sendEmail(mailOptions: MailOptions): Promise<SentMessageInfo | boolean> {
      try{
          return await this.mailerService.sendMail(mailOptions);
      } catch (ex: any) {
          Logger.error(ex);
          return false;
      }
    }
}