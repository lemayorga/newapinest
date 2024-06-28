import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaginationService } from './services/pagination-query';
import { getEnvPath } from 'src/config/enviroments';

@Module({
  imports:[
    ConfigModule.forRoot({ 
      envFilePath: getEnvPath(),
      isGlobal: true 
    }),
  ],
  providers: [
    PaginationService
  ],
  exports:[
    PaginationService
  ]
})
export class SharedModule {}
