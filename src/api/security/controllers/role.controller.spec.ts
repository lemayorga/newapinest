import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { agent as supertest } from 'supertest';
import { Catalogue } from 'src/database/models/commun';
import { SharedModule } from 'src/api/shared/shared.module';
import { SequelizeSqliteTestingModule, createSqliteDB } from "src/config/creatememdb";
import { PageOptionsDto, SortOrder } from "src/api/shared/models";
import { randomInteger } from "src/utils";
import { RolController } from "./role.controller";
import { RolService } from "../services";
import { SecurityProviders } from "../security.provider";
import { Role, User, UsersRoles } from "src/database/models/security";
import { ConfigModule, ConfigService } from "@nestjs/config";

describe('RolController',() => {

    const url = `/security/role`;
    let app: INestApplication; let api: any;
    let _controller : RolController;
    let _service: RolService;   

    // const _catalogue = [
    //     {  codRol: 'GUESS ', name: 'guess' },
    //     {  codRol: 'SALE ', name: 'sales' },
    //     {  codRol: 'MANAGER ', name: 'manager' },
    //     {  codRol: 'OPERATIONS ', name: 'operations' },
    // ];

    const pageOptions: PageOptionsDto = {  page: 1,  take: 10,  order: SortOrder.ASC, searchs: 'GUESS'  };
    let config: ConfigService;
    
    beforeAll(async () => {

        await createSqliteDB([Role, UsersRoles, User]);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
             ...SequelizeSqliteTestingModule(),
              ConfigModule,
              SharedModule
            ],
            providers: [
              ...SecurityProviders,
             RolService,
    //             {
    //     provide: ConfigService,
    //     useValue: createMock<ConfigService>(),
    //   },
            ],
            controllers: [
                RolController
            ],
        }).compile();

        _controller = moduleFixture.get<RolController>(RolController);
        _service = moduleFixture.get<RolService>(RolService); 

        app = moduleFixture.createNestApplication({ rawBody: true });        
        app.useGlobalPipes(new ValidationPipe({
            transform: true , 
            transformOptions: { enableImplicitConversion: true }
        }));

        await app.init();
        api = app.getHttpServer();

 
        // const response = await agent.post('/api/auth/login', { username: 'tester', password: 'tester' });
        // agent.auth(response.accessToken, { type: 'bearer' });
        let token = '';
        const agent  = supertest(api);
        const originalMethod = agent.patch;
        
        agent.patch = (url: string, ...args) => {
          return originalMethod(url, ...args)
            .set('Content-Type', 'application/json')
            .set('X_CONNECTION_KEY', 'XXX')
            .set({ Authorization: `Bearer ${token}` });
        };
        //https://github.com/ladjs/supertest/issues/398
        // https://github.com/ladjs/superagent/tree/3c9c0f7feef61328131ae43b06e628bce1c20c17

    });

    it('should be defined', () => {
        expect(_controller).toBeDefined();
        expect(_service).toBeDefined();
    });

});