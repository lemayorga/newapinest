import { join } from 'path';
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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public')
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate
    }), // Import ConfigModule
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
