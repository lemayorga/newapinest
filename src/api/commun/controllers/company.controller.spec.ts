import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { SuperAgentTest, agent as supertest }  from 'supertest';
import { Company } from 'src/database/models/commun';
import { SharedModule } from 'src/api/shared/shared.module';
import { CommunProviders } from "../commun.provider";
import { CompanyController } from "./company.controller";
import { CompanyService } from "../services";
import { SequelizeSqliteTestingModule, createSqliteDB } from "src/config/creatememdb";
import { randomInteger } from "src/utils";
import { PageOptionsDto, SortOrder } from "src/api/shared/models";

describe('CompanyController',() => {

    const url = `/commun/company`;
    let app: INestApplication; 
    let agent: SuperAgentTest;
    let _controller : CompanyController;
    let _service: CompanyService;   

    const _companies = [
        {  name: 'IBM', isActive: true, companySuccessorId: null },
        {  name: 'Meta', isActive: true , companySuccessorId: null },
        {  name: 'Microsoft', isActive: true , companySuccessorId: null },
        {  name: 'Honda', isActive: true, companySuccessorId: null },
        {  name: 'Toyota', isActive: true , companySuccessorId: null }
    ];

    const pageOptions: PageOptionsDto = {
      page: 1,
      take: 10,
      order: SortOrder.ASC,
    };
    
    beforeAll(async () => {

        await createSqliteDB([Company]);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
             ...SequelizeSqliteTestingModule,
              SharedModule
            ],
            providers: [
              ...CommunProviders,
              CompanyService
            ],
            controllers: [  CompanyController  ],
        }).compile();

        _controller = moduleFixture.get<CompanyController>(CompanyController);
        _service = moduleFixture.get<CompanyService>(CompanyService); 

        app = moduleFixture.createNestApplication({ rawBody: true });        
        app.useGlobalPipes(new ValidationPipe({
            transform: true , 
            transformOptions: { enableImplicitConversion: true }
        }));

        await app.init();
        agent = supertest(app.getHttpServer());

        for(let data of _companies.filter((item, index) => index > 0)){
          _service.create(data);
        }
    });

    it('should be defined', () => {
        expect(_controller).toBeDefined();
        expect(_service).toBeDefined();
    });


    it('POST / → should successfully insert a Company', async  () => {
      const [data] = _companies;
      const response = await  agent.post(url).send(data);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({
          isSuccess: true,
          isFailure: false,
          data: expect.any(Object)
        })
      );
      
      expect(response.body.data.name).toEqual(data.name);
    });

    it('GET / → should return array Companies', async  () => {
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



    it('GET /:id → should return a Company by Id', async  () => {

      const id = randomInteger(1, _companies.length);
      const response = await  agent.get(`${url}/${id}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual(
        expect.objectContaining({
          isSuccess: true,
          isFailure: false,
          data: expect.any(Object)
        })
      );
      expect(_companies.some(x => x.name === response.body.data.name)).toEqual(true);
    });


    it('GET /paginate → should return array Company', async  () => {
        const response = await agent.get(`${url}/paginate?page=${pageOptions.page}&take=${pageOptions.take}&order=${pageOptions.order}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toEqual(
          expect.objectContaining({
            currentPage: pageOptions.page,
            take: pageOptions.take
          })
        );
    });

    it('PUT /:id → should successfully update a Company by ID', async  () => {
          const id = randomInteger(1, _companies.length);
          const response = await agent.put(`${url}/${id}`)
                          .send({
                            name: `Cambio nombre _${randomInteger(1, 100)}`,
                            isActive: false
                          });
  
          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toEqual(
            expect.objectContaining({
              isSuccess: true,
              isFailure: false,
              data: expect.any(Object)
            })
          );
          expect(response.body.data.isActive).toEqual(false);
    });


    it('DELETE /:id → should not delete a company by ID ', async  () => {
      const id = randomInteger(1, _companies.length);
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


    it('DELETE /:id → mistake delete a Company by ID not exists', async  () => {
      const id = randomInteger(_companies.length + 1, 100);
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


