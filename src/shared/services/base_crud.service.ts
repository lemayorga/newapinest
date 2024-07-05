import { HttpStatus, Logger } from '@nestjs/common';
import { Model, ModelCtor } from "sequelize-typescript";
import { IRepo, RepoResult, RepoError, RequestResult } from "../models";

export abstract class RepositoryCrudService<M extends Model, T , TC , TU> implements IRepo<M, T, TC , TU> {
  protected Model!: ModelCtor<M>;

  constructor(Model: ModelCtor<M>) {
      this.Model = Model;
  }
 
  /**
   * Get all records 
   * @param orderDefault Boolean to aply order defatul that it's order by id ASC
   * @param orderBy 
   * @returns 
   */
  public async getAll(orderDefault: boolean = true, orderBy:string[] = null): RepoResult<T[]> {
    try {
        let orderById: any[] = orderDefault ? ([ orderBy ??   ['id', 'ASC'] ]) : ( orderBy ? [ orderBy ] : null);

        const data = await this.Model.findAll({ raw : true , nest : true , order: orderById });
  
        const result : T[] =  data.map(m =>  Object.assign({}, m) as T);
        return RequestResult.ok(result);
      
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Get all records 
   * @param options Options filter from Squelize
   * @returns 
   */
  public async findAll(options?: any): RepoResult<T[]> {
    try {

        let opt = { raw : true , nest : true };
        if(options){
          opt = {
            ...opt,
            ...options
          } 
        }
        const data = await this.Model.findAll(opt);
        const result : T[] =  data.map(m =>  Object.assign({}, m) as T);
        return RequestResult.ok(result);
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
 
  /**
   * Get one record
   * @param options Options filter from Squelize
   * @returns 
   */
  public async findOne(options?: any):  RepoResult<T | null> {
    try {

        let opt = { raw : true , nest : true }
        if(options){
          opt = {
            ...opt,
            ...options
          } 
        }

        const data = await this.Model.findOne(opt);
        const result : T = Object.assign({}, data) as T;
        if(data)
          return RequestResult.ok(result);

        return RequestResult.ok(null);
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

   /**
    * Get one record by id
    * @param ids Id record
    * @returns 
    */
  public async findByIds(ids: number[]): RepoResult<T[]> {
    try {
      const filter : any = {  where: {  id: ids   } , raw : true , nest : true };
      const data = await this.Model.findAll(filter);
      const result : T[] =  data.map(m =>  Object.assign({}, m) as T);

      if(data)
        return RequestResult.ok(result);
    
      return RequestResult.ok(null);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, 500));
    }
  }
 /**
  * Get one record by id
  * @param id Id record
  * @returns 
  */
  public async findById(id: number): RepoResult<T | null> {
    try {
      const filter : any = {  where: {  id: id   }, raw : true , nest : true  };
      const data = await this.Model.findOne<M>(filter);
      const result : T = Object.assign({}, data) as T;
      if(data)
        return RequestResult.ok(result);
    
      return RequestResult.ok(null);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

 /**
  * Delete record by id
  * @param id Id record
  * @returns 
  */
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
  /**
   * Delete records by ids
   * @param ids ids of records
   * @returns 
   */
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
 
  /**
   * Insert value record in Database
   * @param data value record
   * @returns value record from Database
   */
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

 /**
  * Update record by id
  * @param id Id record
  * @param data New property's values to update record
  * @returns 
  */
  public async updateById(id: number, data: TU): RepoResult<T | null> {
    try {

      const filter : any = {  where: {  id   }, returning: true   };
      const [affectedCount, affectedRows] = await this.Model.update(data, filter);
            
      if(affectedCount > 0 && affectedRows) {

        const result : T = Object.assign({}, affectedRows[0].dataValues) as T;
        return RequestResult.ok(result);

      } else {
        const record = await this.Model.findOne<M>(filter);
        if(record){
          const result : T = Object.assign({}, record.dataValues) as T;
          return RequestResult.ok(result);
        }
      }
      return RequestResult.ok(null);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public convertToDto(model: M) : T{
    const values = model.get({ plain: true });
    return Object.assign({}, values) as T;
  }

}