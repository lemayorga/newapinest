
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from 'src/config/enviroments';
import { PaginationService } from "./services";


@Global()
@Module({
    imports: [ 
        ConfigModule.forRoot({ 
            envFilePath: getEnvPath(),
            isGlobal: true 
        }),
    ],
    providers: [ PaginationService  ],
    exports: [  PaginationService ]
})
export class SharedModule {}