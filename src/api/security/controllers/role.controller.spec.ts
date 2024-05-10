import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { SuperAgentTest, agent as supertest } from 'supertest';
import { SharedModule } from 'src/api/shared/shared.module';
import { SequelizeSqliteTestingModule, createSqliteDBWithDataSecurity, rolesTestDefault } from "src/config/creatememdb";
import { randomInteger } from "src/utils";
import { RolController } from "./role.controller";
import { RolService } from "../services";
import { SecurityProviders } from "../security.provider";
import { ConfigService } from "@nestjs/config";
import { EnvCofigName } from "src/config/environment.validation";
import { AuthModule } from "src/api/auth/auth.module";
import { AuthService } from "src/api/auth/services/auth.service";
import { PassportModule } from "@nestjs/passport";

describe('RolController',() => {

    const url = `/security/role`;
    let app: INestApplication;
    let agent: SuperAgentTest;
    let config: ConfigService;
    let _controller : RolController;
    let _service: RolService;   
    let _serviceAuth: AuthService;   

    //  const pageOptions: PageOptionsDto = {  page: 1,  take: 10,  order: SortOrder.ASC, searchs: 'GUESS'  } 


    beforeAll(async () => {

        await createSqliteDBWithDataSecurity([]);
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
              ...SequelizeSqliteTestingModule,
              SharedModule,
              AuthModule,
              PassportModule.register({ defaultStrategy:  'jwt' }),
            ],
            providers: [
              ...SecurityProviders,
             RolService,
            ],
            controllers: [
                RolController
            ],
        }).compile();

        config = moduleFixture.get(ConfigService);
        _controller = moduleFixture.get<RolController>(RolController);
        _service = moduleFixture.get<RolService>(RolService); 
        _serviceAuth = moduleFixture.get(AuthService);

        app = moduleFixture.createNestApplication({ rawBody: true });        
        app.useGlobalPipes(new ValidationPipe({
            transform: true , 
            transformOptions: { enableImplicitConversion: true }
        }));

        await app.init();

        const userLogin = {
            user: config.get<string>(EnvCofigName.DEFAULT_USER_EMAIL),
            password: config.get<string>(EnvCofigName.DEFAULT_USER_PASSWORD)  
        };
    
        const loginResponse = await _serviceAuth.login(userLogin);
        agent = supertest(app.getHttpServer());
        agent.auth(loginResponse.token, { type: 'bearer' });
        //https://github.com/ladjs/supertest/issues/398
        // https://github.com/ladjs/superagent/tree/3c9c0f7feef61328131ae43b06e628bce1c20c17

    });

    it('should be defined', () => {
        expect(_controller).toBeDefined();
        expect(_service).toBeDefined();
    });
    
    it('GET / → should return array roles', async  () => {
        const response = await  agent.get(url);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({
            isSuccess: true,
            isFailure: false,
            data: expect.any(Array)
          })
        );
    });

    it('POST / → should successfully insert a role', async  () => {
        let data = { codRol: 'Demo' , name: 'Rol test' };
        const response = await agent.post(url).send(data);
  
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({  isSuccess: true, isFailure: false,  data: expect.any(Object)  })
        );
        expect(response.body.data).toEqual(expect.objectContaining(data));
    });

    
    it('POST / → should successfully insert a role', async  () => {
      const response = await agent.post(url).send(rolesTestDefault[0]);
      console.log(response.body)

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({  isSuccess: true, isFailure: false,  data: expect.any(Object)  })
      );
      expect(response.body.data).toEqual(expect.objectContaining(rolesTestDefault[0]));
    });

    it('GET /:id → should return a role by Id', async  () => {

        const id = randomInteger(1, rolesTestDefault.length);
        const response = await agent.get(`${url}/${id}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({
            isSuccess: true,
            isFailure: false,
            data: expect.any(Object)
          })
        );
        expect(response.body.data).toBeDefined();
        expect(rolesTestDefault.some(x => x.codRol === response.body.data.codRol)).toEqual(true);
    });

    it('GET /getByCode → should return a role by Code', async  () => {

        const cell = randomInteger(0, rolesTestDefault.length - 1);
        const response = await agent.get(`${url}/getByCode?code=${rolesTestDefault[cell].codRol}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({
            isSuccess: true,
            isFailure: false,
            data: expect.any(Object)
          })
        );
        expect(response.body.data).toBeDefined();
        expect(rolesTestDefault.some(x => x.codRol === response.body.data.codRol)).toEqual(true);
    });   
});