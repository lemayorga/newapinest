import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvCofigName } from 'src/config/environment.validation';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SecurityModule } from '../security/security.module';
import { SecurityProviders } from '../security/security.provider';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [
    AuthController
  ],
  imports:[
    PassportModule.register({ defaultStrategy:  'jwt' }),
    JwtModule.registerAsync({
        global: true,
        imports:[
          ConfigModule
        ],
        inject: [
           ConfigService
       ],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get(EnvCofigName.JWT_SECRET_KEY),
          signOptions: {
            expiresIn: configService.get(EnvCofigName.JWT_REFRESH_SECRET),
          },
        }),
      }),
    ConfigModule,
    SecurityModule,
  ],
  providers: [
      ...SecurityProviders,
      AuthService,
      JwtStrategy,
      RefreshTokenStrategy
  ],
  exports:[
    AuthService
  ]
})
export class AuthModule {}
