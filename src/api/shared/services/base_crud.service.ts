import { HttpStatus, Logger } from '@nestjs/common';
import { Op } from 'sequelize';
import { Model, ModelCtor } from "sequelize-typescript";
import { IRepo, RepoResult , Paginate, RepoError, RequestResult } from "../models";


export abstract class RepositoryCrudService<M extends Model, T , TC , TU> implements IRepo<M, T, TC , TU> {
  protected Model!: ModelCtor<M>;

  constructor(Model: ModelCtor<M>) {
      this.Model = Model;
  }

  public async  getAll(orderDefault: boolean = true, orderBy:string[] = null): RepoResult<T[]> {
    try {
        let orderById: any[] = orderDefault ? ([ orderBy ??   ['id', 'ASC'] ]) : ( orderBy ? [ orderBy ] : null);

        const data = await this.Model.findAll({ raw : true , nest : true , order: orderById });
        // const result: T[] = JSON.parse(JSON.stringify(data));
        const result : T[] =  data.map(m =>  Object.assign({}, m) as T);
        return RequestResult.ok(result);
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async findByIds(ids: number[]): RepoResult<T[]> {
    try {
      const filter : any = {  where: {  id: ids   } , raw : true , nest : true };
      const data = await this.Model.findAll(filter);
      const result : T[] =  data.map(m =>  Object.assign({}, m) as T);

      // if (!doc) { return RequestResult.fail(new RepoError('Not found', 404));  }
      if(data)
        return RequestResult.ok(result);
    
      return RequestResult.ok(null);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, 500));
    }
  }

  public async findById(id: number): RepoResult<T | null> {
    try {
      const filter : any = {  where: {  id: id   }, raw : true , nest : true  };
      const data = await this.Model.findOne<M>(filter);
      const result : T = Object.assign({}, data) as T;
      // if (!doc) { return RequestResult.fail(new RepoError('Not found', 404));  }
      if(data)
        return RequestResult.ok(result);
    
      return RequestResult.ok(null);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async deleteById(id: number): RepoResult<boolean> {
    try {
      const filter : any = {  where: {  id: id   }, raw : true , nest : true  };
      const totalDeleted = await this.Model.destroy(filter);

      if(totalDeleted > 0)
        return RequestResult.ok(true);
  
      return RequestResult.ok(false,'Record not found.');

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async deleteByIds(ids: string[]): RepoResult<boolean> {
    try {
      const filter : any = {  where: {  id: ids   }  };
      const totalDeleted = await this.Model.destroy(filter);

      if(totalDeleted > 0)
        return RequestResult.ok(true);
  
      return RequestResult.ok(false,'Record not found.');

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async create(data: TC): RepoResult<T | null> {
    try {
      const dataSave = this.Model.build({...data} as any,{ raw:true } );
      await dataSave.save()

      const values = dataSave.get({ plain:true });
      const result : T = Object.assign({}, values) as T;

      return RequestResult.ok(result);
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async updateById(id: number, data: TU): RepoResult<T | null> {
    try {

      const filter : any = {  where: {  id: id   }, returning: true  , raw : true , nest : true,  };
      const [ totalUpdate, dataUpdate ] = await this.Model.update(data, filter)
            
      if(totalUpdate > 0) {
        const [ values ] =  dataUpdate;
        const result : T = Object.assign({}, values) as T;
        return RequestResult.ok(result);
      }
    
      return RequestResult.ok(null);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public convertToDto(model: M) : T{
    const values = model.get({ plain:true });
    return Object.assign({}, values) as T;
  }

  public async paginante(pageSize: number, pageNumber: number, pag: Paginate) : RepoResult<M[]> {
    try{
      const offset = pageNumber;
      const limit = pageSize;
      let propFindModel = {  limit: limit,  offset: offset };
  
      if(pag?.search.length > 0){
  
          let whereTemp : any = {};
          let contador: number = 0;

          pag.search.map(filt =>{
              switch(filt.operation){
                  case 'LIKE':
                      whereTemp[filt.name] = {  [Op.like]: `%${filt.value ?? '' }%` };
                      break;
                  case  'EQUAL' :
                      whereTemp[filt.name] = {  [Op.eq]: filt.value  };
                      break;         
                  case  'DIST' :
                      whereTemp[filt.name] = {  [Op.ne]: filt.value  };
                      break;       
                  case  'IN':
                      whereTemp[filt.name] = {  [Op.in]: (filt.value ?? [])  };
                      break;   
                  default:
                      whereTemp[filt.name] = {  [Op.like]: `%${filt.value ?? '' }%` };   
              }
              contador ++;
          });
          
          if(contador > 1){
              propFindModel['where'] = {  [Op.and]: [ { ...whereTemp } ]  };
          } else if(contador === 1){
              propFindModel['where'] = {  ...whereTemp  };
          }
      }
  
  
      if(pag.order && pag?.order.length > 0){
           propFindModel['order'] = pag.order;
      }
  
      if(pag.group && pag?.group.length > 0){
            propFindModel['group'] = pag.group;
      }         
  
      const result = await this.Model.findAll(propFindModel);
      return RequestResult.ok(result);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}
