import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { SuperAgentTest, agent as supertest }  from 'supertest';
import { SharedModule } from 'src/shared/shared.module';
import { createSqliteDB, SequelizeSqliteTestingModule } from "src/database/creatememdb";
import { PageOptionsDto, SortOrder } from "src/shared/models";
import { randomInteger } from "src/utils";
import { CommunProviders } from "../commun.provider";
import { Catalogue } from 'src/database/models/commun';
import { CatalogueService } from "../services";
import { CatalogueController } from "./catalogue.controller";
import { Sequelize } from "sequelize";


describe('CatalogueController',() => {

    const url = `/commun/catalogue`;
    let app: INestApplication; 
    let agent: SuperAgentTest;
    let _controller : CatalogueController;
    let _service: CatalogueService;   

    const _catalogue = [
        {  group: 'Moneda ', value: 'Dolar', isActive: true, description: null },
        {  group: 'Moneda ', value: 'Euros', isActive: true, description: null },
        {  group: 'Movimientos ', value: 'Inventario', isActive: true, description: null },
        {  group: 'Movimientos ', value: 'Facturas', isActive: true, description: null },
        {  group: 'Movimientos ', value: 'Requisas', isActive: true, description: null }
    ];

    const pageOptions: PageOptionsDto = {  page: 1,  take: 10,  order: SortOrder.ASC, searchs: 'MOVIMI'  };
     
    let db : Sequelize;  
    
    beforeAll(async () => {
        db = await createSqliteDB([Catalogue]);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
              ...SequelizeSqliteTestingModule,
              SharedModule
            ],
            providers: [
              ...CommunProviders,
              CatalogueService
            ],
            controllers: [ CatalogueController  ],
        }).compile();

        _controller = moduleFixture.get<CatalogueController>(CatalogueController);
        _service = moduleFixture.get<CatalogueService>(CatalogueService); 

        app = moduleFixture.createNestApplication({ rawBody: true });        
        app.useGlobalPipes(new ValidationPipe({
            transform: true , 
            transformOptions: { enableImplicitConversion: true }
        }));

        await app.init();
        agent = supertest(app.getHttpServer());

        for(let data of _catalogue.filter((item, index) => index > 0)){
          _service.create(data);
        }
    });

    //afterAll(async() => db.drop() );


    it('should be defined', () => {
        expect(_controller).toBeDefined();
        expect(_service).toBeDefined();
    });


    it('POST / → should successfully insert a catalogue', async  () => {
      const [data] = _catalogue;
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
      
      expect(response.body.data.group).toEqual(data.group);
      expect(response.body.data.value).toEqual(data.value);
      expect(response.body.data.description).toEqual(data.description);
    });

    it('GET / → should return array catalogues', async  () => {
        const response = await agent.get(url);
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

    it('GET /:id → should return a catalogue by Id', async  () => {

      const id = randomInteger(1, _catalogue.length);
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

      expect(_catalogue.find(x => x.value === response.body.data.value)).toEqual(
        expect.objectContaining({
          group: response.body.data.group,
          value: response.body.data.value,
          description: response.body.data.description
        })
      );
    });

    it('PUT /:id → should successfully update a Catalogue by ID', async  () => {
          const id = randomInteger(1, _catalogue.length);
          const response = await  agent.put(`${url}/${id}`)
                          .send({
                            group: `Cambio group  _${randomInteger(1, 100)}`,
                            value: `Cambio value  _${randomInteger(1, 100)}`,
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


    it('DELETE /:id → should not delete a Catalogue by ID ', async  () => {
      const id = randomInteger(1, _catalogue.length);
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


    it('DELETE /:id → mistake delete a Catalogue by ID not exists', async  () => {
      const id = randomInteger(_catalogue.length + 1, 100);
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