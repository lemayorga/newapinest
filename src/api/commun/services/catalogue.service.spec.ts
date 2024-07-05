import { Op, Sequelize } from "sequelize";
import { createSqliteDB } from "src/database/creatememdb";
import { RepoError, RequestResult } from "src/shared/models";
import { PaginationService } from "src/shared/services";
import { Catalogue } from "src/database/models/commun";
import { CatalogueCreateDto, CatalogueDto, CatalogueUpdateDto } from "../dtos";
import { CatalogueService } from "./catalogue.sevice";

describe('CatalogueService', () => {

    let _memDb: Sequelize;
    let _service: CatalogueService;
    let _paginationService: PaginationService;
    let resultObj: RequestResult<CatalogueDto, RepoError>;
    let resultList: RequestResult<CatalogueDto[], RepoError>;

    const _catalogue = {
      group: 'marvel',
      value: 'iron man', 
      isActive: true,
      description: 'heroe'
    };

    beforeAll(async () => {
      _memDb = await createSqliteDB([Catalogue]);
      _paginationService = new PaginationService();
      _service = new CatalogueService(Catalogue, _paginationService);
    });

    afterAll(async () =>  {
      await _memDb.close()
    });


    it('should be defined', () => {
      expect(_service).toBeDefined();
    });

    describe('create()', () => {
      it('should successfully insert a catalogue', async () => {

        resultObj = await _service.create(_catalogue as CatalogueCreateDto);
        const { id, ...result } =  resultObj.getValue();
        expect(result).toEqual(_catalogue);
      });
    });
  
    describe('getAll()', () => {
      it('should return an array of catalogues', async () => {

        resultList = await _service.getAll();
        expect(resultList.isSuccess).toBe(true);
      });
    });

    describe('findAll()', () => {
      it('should return an array of catalogues', async () => {

        resultList = await _service.findAll();
        expect(resultList.isSuccess).toBe(true);
      });
    });


    describe('findOne()', () => {
      it('should get a single catalogue', async () => {
        resultObj = await  _service.findOne({ where: { value: _catalogue.value } });
        expect(resultObj.isSuccess).toEqual(true);
      });
    });

    describe('findById()', () => {
      it('should get a single catalogue', async () => {
          resultObj = await _service.findById(1);
         expect(resultObj.isSuccess).toEqual(true);
      });
    });

    describe('updateById()', () => {
      it('should update a catalogue', async () => {

        resultObj =  await  _service.findOne();

        let data  = resultObj.getValue();
      
        const { id , ...result } = data;
        result.isActive = !result.isActive; 

        resultObj = await  _service.updateById(id, result as CatalogueUpdateDto);

        expect(resultObj.isSuccess).toBe(true);
      });
    });

    describe('deleteById()', () => {
      it('should remove a catalogue', async () => {

        resultObj = await  _service.findOne({ where: { value: { [Op.like] : `%${_catalogue.value}%` }  } });
    
        const data = resultObj.getValue();
        
        const result =  await _service.deleteById(data.id);
        expect(result.isSuccess).toBe(true);
      });
    });
});