import { Op, Sequelize } from "sequelize";
import { CompanyService } from "./company.service";
import { createSqliteDB } from "src/config/creatememdb";
import { RepoError, RequestResult } from './../../shared/models';
import { Company } from "src/database/models/commun";
import { PaginationService } from "src/api/shared/services";
import { CompanyCreateDto, CompanyDto, CompanyUpdateDto } from "../dtos";

describe('CompanyService', () => {

    let _memDb: Sequelize;
    let _service: CompanyService;
    let _paginationService: PaginationService;
    let resultObj: RequestResult<CompanyDto, RepoError>;
    let resultList: RequestResult<CompanyDto[], RepoError>;

    const _company = {
      name: 'marvel', 
      isActive: true
    };

    beforeAll(async () => {
      _memDb = await createSqliteDB([Company]);
      _paginationService = new PaginationService();
      _service = new CompanyService(Company, _paginationService);
    });

    afterAll(async () =>  {
      await _memDb.close()
    });

    // afterEach(async () => await _memDb.truncate());

    it('should be defined', () => {
      expect(_service).toBeDefined();
    });

    describe('create()', () => {
      it('should successfully insert a company', async () => {

        resultObj = await _service.create(_company as CompanyCreateDto);
        const { id, ...result } =  resultObj.getValue();
        expect(result).toEqual(_company);
      });
    });
  
    describe('getAll()', () => {
      it('should return an array of companies', async () => {

        resultList = await _service.getAll();
        expect(resultList.isSuccess).toBe(true);
      });
    });

    describe('findAll()', () => {
      it('should return an array of companies', async () => {

        resultList = await _service.findAll();
        expect(resultList.isSuccess).toBe(true);
      });
    });

    describe('paginate()', () => {
      it('should return an array paginate of companies', async () => {
        const result = await _service.paginate({ page: 1, take: 5  });
        expect(result.data.length).toBeGreaterThanOrEqual(0);
      });

      it('should return an array paginate of companies searchs', async () => {
        const result = await _service.paginate({ page: 1, take: 5 , searchs: _company.name });
        expect(result.data.length).toBeGreaterThanOrEqual(0);
      });
    });


    describe('findOne()', () => {
      it('should get a single company', async () => {
        resultObj = await  _service.findOne({ where: { name: _company.name } });
        expect(resultObj.isSuccess).toEqual(true);
      });
    });

    describe('findById()', () => {
      it('should get a single company', async () => {
          resultObj = await _service.findById(1);
         expect(resultObj.isSuccess).toEqual(true);
      });
    });

    describe('updateById()', () => {
      it('should update a company', async () => {

        resultObj =  await  _service.findOne();

        let data  = resultObj.getValue();
      
        const { id , ...result } = data;
        result.isActive = !result.isActive; 

        resultObj = await  _service.updateById(id, result as CompanyUpdateDto);

        expect(resultObj.isSuccess).toBe(true);
      });
    });

    describe('deleteById()', () => {
      it('should remove a company', async () => {

        resultObj = await  _service.findOne({ where: { name: { [Op.like] : `%${_company.name}%` }  } });
    
        const data = resultObj.getValue();
        
        const result =  await _service.deleteById(data.id);
        expect(result.isSuccess).toBe(true);
      });
    });
});