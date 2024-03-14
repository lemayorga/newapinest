import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { EnvCofigName } from 'src/config/environment.validation';

@Module({
  imports:[
    ConfigModule,
    MailerModule.forRootAsync({
      inject: [
         ConfigService
       ],
       useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get(EnvCofigName.MAIL_HOST),
          port:  config.get<number>(EnvCofigName.MAIL_PORT),
          secure: false,
          auth: {
            user: config.get(EnvCofigName.MAIL_USER),
            pass: config.get(EnvCofigName.MAIL_PASSWORD),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get(EnvCofigName.MAIL_FROM)}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      })
    })
  ],
  providers: [
    MailService
  ],
  exports:[
    MailService
  ]
})
export class MailModule {}
