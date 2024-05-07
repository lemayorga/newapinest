import { Model } from "sequelize";
import { NonAbstract } from "sequelize-typescript/dist/shared/types";
import { Paginate, RepoError, RequestResult } from ".";

export type RepoResult<M> = Promise<RequestResult<M | undefined, RepoError | undefined>>;

export declare type Repository<M> = (new () => M) & NonAbstract<typeof Model>;

export declare type ModelCtor<M extends Model = Model> = Repository<M>;

export interface IRepo<M, T, TC , TU> {
  create(model: TC): RepoResult<T>;
  getAll(orderDefault: boolean, orderBy:string[]): RepoResult<T[]>;
  findById(id: number): RepoResult<T>;
  findByIds(ids: number[]): RepoResult<T[]>;
  deleteById(id: number): RepoResult<boolean>;
  deleteByIds(ids: string[]): RepoResult<boolean>;
  updateById(id: number, data: TU): RepoResult<T>;
};