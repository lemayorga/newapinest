import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { SuperAgentTest, agent as supertest } from 'supertest';
import { SharedModule } from 'src/api/shared/shared.module';
import { SequelizeSqliteTestingModule, createSqliteDB } from "src/config/creatememdb";
import { UserController } from "./user.controller";
import { UserService } from "../services";
import { SecurityProviders } from "../security.provider";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnvCofigName } from "src/config/environment.validation";
import { AuthModule } from "src/api/auth/auth.module";
import { AuthService } from "src/api/auth/services/auth.service";
import { PassportModule } from "@nestjs/passport";
import { ChangePasswordUserDto, UserCreateDto, UserUpdateDto } from "../dtos";
import { PageOptionsDto, SortOrder } from "src/api/shared/models";


describe('UserController',() => {

    const url = `/security/user`;
    let app: INestApplication;
    let agent: SuperAgentTest;
    let _controller : UserController;
    let _service: UserService;   
    let _serviceAuth: AuthService;   

    const pageOptions: PageOptionsDto = {  page: 1,  take: 10,  order: SortOrder.ASC, searchs: 'user'  };
    let userDemo: UserCreateDto = 
    { 
        username: 'user 1', 
        firstname: 'user firstname', 
        lastname: 'user lastname' , 
        password: 'ApiNestjs*', 
        email: 'demo@gmail.com'
    };

    beforeAll(async () => {

        await createSqliteDB([], true, true);

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
              UserService,
            ],
            controllers: [   UserController  ],
        }).compile();

        let config: ConfigService = moduleFixture.get(ConfigService);
        _controller = moduleFixture.get<UserController>(UserController);
        _service = moduleFixture.get<UserService>(UserService); 
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
    });

    it('should be defined', () => {
        expect(_controller).toBeDefined();
        expect(_service).toBeDefined();
    });
    
    it('GET / → should return array users', async  () => {
        const response = await  agent.get(url);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({  isSuccess: true,  isFailure: false,   data: expect.any(Array) })
        );
    });

    it('POST / → should successfully insert a user', async  () => {
        const response = await agent.post(url).send(userDemo);

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({  isSuccess: true, isFailure: false,  data: expect.any(Object)  })
        );
    });

    it('GET /:id → should return a user by Id', async  () => {
        const id  = 2;
        const response = await agent.get(`${url}/${id}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({   isSuccess: true,   isFailure: false,  data: expect.any(Object) })  );
        expect(response.body.data).toBeDefined();
    });    
    
    it('GET /paginate → should return array users', async  () => {
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

    it('GET /paginate&searchs → should return array users', async  () => {
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

     it('PUT /:id → should successfully update a user by ID', async  () => {
      const userUpdate: UserUpdateDto = {
            username: userDemo.username,
            email: userDemo.email,
            firstname: 'Sebastian Javier',
            lastname: 'Morales Gaitan',
            isActive: true
      };

      const id = 2;
      const response = await  agent.put(`${url}/${id}`).send(userUpdate);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({  isSuccess: true,  isFailure: false,   data: expect.any(Object)  })
      );
      expect(response.body.data.firstname).toEqual(userUpdate.firstname);
      expect(response.body.data.lastname).toEqual(userUpdate.lastname);

    });

    it('PUT /changePassword → Validation new password can not be identical current password', async  () => {
      const userUpdate: ChangePasswordUserDto = 
      {
        username: userDemo.email,
        currentPassword: userDemo.password,
        newPassword:userDemo.password, 
        compareCurrentPasswords: false
      };

      const response = await  agent.put(`${url}/changePassword`).send(userUpdate);
      expect(response.body).toEqual(
        expect.objectContaining({  isSuccess: false,  isFailure: true })
      );
    });

    it('PUT /changePassword → Validation current password is incorrect', async  () => {
      const userUpdate: ChangePasswordUserDto = 
      {
        username: userDemo.email,
        currentPassword: '*AbC34K',
        newPassword:  '*AbC34K125',
        compareCurrentPasswords: true
      };

      const response = await  agent.put(`${url}/changePassword`).send(userUpdate);
      expect(response.body).toEqual(
        expect.objectContaining({  isSuccess: false,  isFailure: true  })
      );
    });

     it('PUT /changePassword → should successfully change password', async  () => {
      const userUpdate: ChangePasswordUserDto = 
      {
        username: userDemo.email,
        currentPassword: userDemo.password,
        newPassword: 'MiPaisHermoso2024*+',
        compareCurrentPasswords: true
      };

      const response = await  agent.put(`${url}/changePassword`).send(userUpdate);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({  isSuccess: true,  isFailure: false,   data: expect.any(Object)  })
      );
    });


    it('DELETE /:id → should not delete a user by ID ', async  () => {
      const id = 2;
      const response = await  agent.delete(`${url}/${id}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({  isSuccess: true,   isFailure: false })
      );
    });


    it('DELETE /:id → mistake delete a user by ID not exists', async  () => {
      const id = 2;
      const response = await  agent.delete(`${url}/${id}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({  isSuccess: true,  isFailure: false, data: false  })
      );
    });

});