import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '../shared/shared.module';
import { SecurityProviders } from './security.provider';
import { 
  RolService, 
  UserService
} from './services';
import { RolController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';


@Module({
  controllers: [
      RolController,
      UserController
    ],
    imports:[
      ConfigModule,
      SharedModule,
      PassportModule.register({ defaultStrategy:  'jwt' }),
    ],
    providers: [
      ...SecurityProviders,
      RolService,
      UserService,
    ],
    exports:[
      RolService,
      UserService
    ]
})
export class SecurityModule { }
