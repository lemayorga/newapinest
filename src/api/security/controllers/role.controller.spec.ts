import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { SuperAgentTest, agent as supertest } from 'supertest';
import { SharedModule } from 'src/api/shared/shared.module';
import { SequelizeSqliteTestingModule, createSqliteDBWithDataSecurity, rolesTestDefault } from "src/config/creatememdb";
import { randomInteger } from "src/utils";
import { RolController } from "./role.controller";
import { RolService } from "../services";
import { SecurityProviders } from "../security.provider";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnvCofigName } from "src/config/environment.validation";
import { AuthModule } from "src/api/auth/auth.module";
import { AuthService } from "src/api/auth/services/auth.service";
import { PassportModule } from "@nestjs/passport";
import { RolCreateDto } from "../dtos";
import { PageOptionsDto, SortOrder } from "src/api/shared/models";

describe('RolController',() => {

    const url = `/security/role`;
    let app: INestApplication;
    let agent: SuperAgentTest;
    let _controller : RolController;
    let _service: RolService;   
    let _serviceAuth: AuthService;   
    const pageOptions: PageOptionsDto = {  page: 1,  take: 10,  order: SortOrder.ASC, searchs: 'GUESS'  } 

    let rolDemo: RolCreateDto = { codRol: 'DEMO' , name: 'Rol_test' };

    beforeAll(async () => {

        await createSqliteDBWithDataSecurity([]);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
              ...SequelizeSqliteTestingModule,
              ConfigModule,
              SharedModule,
              AuthModule,
              PassportModule.register({ defaultStrategy:  'jwt' }),
            ],
            providers: [
              ...SecurityProviders,
             RolService,
            ],
            controllers: [   RolController  ],
        }).compile();

        let config: ConfigService = moduleFixture.get(ConfigService);
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
        // .set('Authorization', `Bearer ${token}`); // Works.
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
          expect.objectContaining({  isSuccess: true,  isFailure: false,   data: expect.any(Array) })
        );
    });

    it('POST / → should successfully insert a role', async  () => {
        const response = await agent.post(url).send(rolDemo);
        rolesTestDefault.push(rolDemo);

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({  isSuccess: true, isFailure: false,  data: expect.any(Object)  })
        );
        expect(response.body.data).toEqual(expect.objectContaining(rolDemo));
    });

    it('POST  / → validate duplicate  insert a role', async  () => {
        const response = await agent.post(url).send(rolDemo);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({  isSuccess: false, isFailure: true   })
        );
    });

    it('GET /:id → should return a role by Id', async  () => {

        const id = randomInteger(1, rolesTestDefault.length - 1);
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

        const cell = randomInteger(1, rolesTestDefault.length - 1);
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
        expect(rolesTestDefault.some(x => x.codRol === response.body.data.codRol)).toEqual(true);
    });  
    
    
    it('GET /paginate → should return array roles', async  () => {
      const response = await  agent.get(`${url}/paginate?page=${pageOptions.page}&take=${pageOptions.take}&order=${pageOptions.order}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({
          currentPage: pageOptions.page,
          take: pageOptions.take,
          data: expect.any(Array)
          })
        );
        expect(response.body.data).toEqual(expect.any(Array));
    });

    it('GET /paginate&searchs → should return array roles', async  () => {
      const uri = `${url}/paginate?page=${pageOptions.page}&take=${pageOptions.take}&order=${pageOptions.order}&searchs=${pageOptions.searchs}`;
      const response = await  agent.get(uri);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({
          currentPage: pageOptions.page,
          take: pageOptions.take
          })
        );
     });

     it('PUT /:id → should successfully update a role by ID', async  () => {
   
      const cell = rolesTestDefault.findIndex(r => r.codRol == rolDemo.codRol);
      let rolUpdate = {
        ...rolesTestDefault.at(cell),
        name: `${rolesTestDefault.at(cell).name} EXAMPLE`
      };

      const response = await  agent.put(`${url}/${cell + 1}`)
                      .send(rolUpdate);

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

    it('DELETE /:id → should not delete a role by ID ', async  () => {
      const id = randomInteger(1, rolesTestDefault.length);
      const response = await  agent.delete(`${url}/${id}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({
          isSuccess: true,
          isFailure: false,
        })
      );
    });


    it('DELETE /:id → mistake delete a role by ID not exists', async  () => {
      const id = randomInteger(rolesTestDefault.length + 1, 100);
      const response = await  agent.delete(`${url}/${id}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({
          isSuccess: true,
          isFailure: false,
          data: false
        })
      );
    });

});