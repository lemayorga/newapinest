import { join, resolve } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { validate } from './config/environment.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CommunModule } from './api/commun/commun.module';
import { SecurityModule } from './api/security/security.module';
import { AuthModule } from './api/auth/auth.module';
import { MailModule } from './mail/mail.module';
import  { getEnvPath } from './config/enviroments';
import 'dotenv/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public')
    }),
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      isGlobal: true,
      validate,
    }), 
    DatabaseModule,
    AuthModule,
    CommunModule,
    SecurityModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


/**
 * 
 * 
 * https://tkssharma.com/nestjs-module-how-to-manage-environment-variables/
 * https://platzi.com/clases/2274-nestjs-modular/37254-configuracion-por-ambientes/
 * https://dev.to/pitops/managing-multiple-environments-in-nestjs-71l
 */