import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaginationService } from './services/pagination-query';

@Module({
  imports:[
    ConfigModule,
  ],
  providers: [
    PaginationService
  ],
  exports:[
    PaginationService
  ]
})
export class SharedModule {}
