import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { PROVIDER_NAMES } from '../security.provider';
import { RepoResult, RepoError, RequestResult, PageOptionsDto, PageMeta, SortOrder } from 'src/api/shared/models';
import { PaginationService, RepositoryCrudService } from 'src/api/shared/services';
import { Role, User, UsersRoles } from 'src/database/models/security';
import { RolCreateDto, RolDto, RolUpdateDto, RolUserResultDto } from '../dtos';

@Injectable()
export class RolService extends RepositoryCrudService<Role, RolDto, RolCreateDto , RolUpdateDto> {

  constructor(
    @Inject(PROVIDER_NAMES.SECURITY_ROLE) private readonly repositoryRole: typeof Role,
    @Inject(PROVIDER_NAMES.SECURITY_USERS_IN_ROLES) private readonly repositoryRoleUsersRoles: typeof UsersRoles,
    private paginationService: PaginationService
  ){
    super(Role);
  }

  public override async create(data: RolCreateDto): RepoResult<RolDto | null> {
    try {

      const { codRol, name } = data;
      const isRoleExists = await this.isRoleExist(codRol,name);
      if(isRoleExists){
        return RequestResult.fail(new RepoError( `Code rol: ${codRol} or name rol: ${name}  already exists.`, HttpStatus.AMBIGUOUS));
      }
       
      const model = await this.repositoryRole.create(data,{ returning: true, raw : true , nest : true });
      const result = {
        id : model.id,
        codRol: codRol.toUpperCase().trim(),
        name
      } as RolDto;
    
      return RequestResult.ok(result);
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  
 /**
  *  Determinate if role exists 
  * @param code Code role
  * @param name  Name role
  * @param idRole  Id role
  * @returns if it exists return true
  */
  public async isRoleExist(code: string, name: string, idRole: number = 0): Promise<boolean> {
    const { count  } =  await this.repositoryRole.findAndCountAll({
      where: {
        id:{ [Op.not]: idRole },
        [Op.or]:[
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('rol_name')), {  [Op.eq]: `${name.toLowerCase()}`  }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('cod_rol')), {  [Op.eq]: `${code.toLowerCase()}`  }),
        ]
      }
    });
    return count > 0;
  }
  
  /**
   * Finding a role by code role
   * @param codeRole code rol to find
   * @returns objecto Rol
   */
  public async findByCode(codeRole: string): RepoResult<RolDto | null> {
    try {
      const data =  await this.repositoryRole.findOne({ where: { codRol: codeRole }})
      if(data){
        const result = this.convertToDto(data);
        return RequestResult.ok(result);
      }
      return RequestResult.ok(null);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

 /**
  * Asociate rol a lot users
  * @param codeRole code rol
  * @param uesrIds  array of users ids
  * @returns array of role and user by parameter code rol
  */
  public async asignateUsersByCodeRole(codeRole: string, uesrIds: number[]) : RepoResult<RolUserResultDto[]> {
    try {

      const role =  await this.repositoryRole.findOne({ where: { codRol: codeRole }})

      if(!role){
        return RequestResult.fail(new RepoError('Role does not found', HttpStatus.NOT_FOUND));
      }

      const usersRolesExists =  await this.repositoryRoleUsersRoles.findAll({
          attributes: [ 'idUser'],
          raw: true,
          where: {
          idRol: role.id,
          idUser: { [Op.in]: uesrIds }
        }
      });

      const  data: UsersRoles[] = uesrIds.filter(userId => !usersRolesExists.map(y => y.idUser).includes(userId))
      .map(userId => {
        return { idUser: userId,   idRol: role.id  } as  UsersRoles
      });

      await this.repositoryRoleUsersRoles.bulkCreate(data);

      const usersRoles = await this.repositoryRole.findOne({
          where: { codRol: codeRole },
          attributes: ['codRol', 'id','name'] ,
          include: [{
            model:  User,
            attributes:[ 'username', 'firstname' ,'lastname'  ]
          }]
      });

      let result: RolUserResultDto[] = []; 

      if(usersRoles.users){ 
        result = usersRoles.users.map(val => {
          return  {
              idRol: role.id,
              codRol: role.codRol,
              rolName: role.name,
              username: val.username,
              firstname: val.firstname,
              lastname: val.lastname,
          } as RolUserResultDto;
        });

      }

      return RequestResult.ok(result);


    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }     
  }
 
  /**
   * Method of pagination
   * @param options Options
   * @param order_by type order to apply
   * @returns Object data with pagination
   */
  public async paginate(options: PageOptionsDto, order_by?: string) {
    let paginationOptions: PageMeta = new PageMeta(options.take, options.page);

     if (options.searchs) {
       paginationOptions.searchs = {
          where: {
            [Op.or]:[
              Sequelize.where(Sequelize.fn('lower', Sequelize.col('rol_name')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              Sequelize.where(Sequelize.fn('lower', Sequelize.col('cod_rol')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
            ]
           }
       };
     }

     const transform = (records: Role[]): RolDto[] => {
       const result: RolDto[] = records.map(record => {
           return   {
              id : record.id,
              codRol: record.codRol,
              name: record.name,
           } 
       }) ;
       return result;
    }

     if (order_by && options.order) {
       paginationOptions.order.push([order_by, options.order]);
     }else{
       paginationOptions.order.push(['id', options.order ?? SortOrder.ASC]);
     }

     const result = await this.paginationService.paginante<RolDto>(Role, paginationOptions, transform);
     return result;
  }
}


