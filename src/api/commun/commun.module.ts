import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../shared/shared.module';
import { CommunProviders } from './commun.provider';
import { 
  CatalogueService, 
  CompanyService 
} from './services';
import { CompanyController } from './controllers/company.controller';
import { CatalogueController } from './controllers/catalogue.controller';

@Module({
  controllers: [
    CatalogueController,
    CompanyController
  ],
  imports:[
    ConfigModule,
    SharedModule
  ],
  providers: [
    ...CommunProviders,
    CatalogueService,
    CompanyService,
  ],
  exports:[
    CatalogueService,
    CompanyService,
  ]
})
export class CommunModule {}
