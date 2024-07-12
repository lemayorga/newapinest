import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { PaginationService, RepositoryCrudService } from 'src/shared/services';
import { RepoResult, RepoError, RequestResult, PageOptionsDto, PageMeta, SortOrder } from 'src/shared/models';
import { PROVIDER_NAMES } from '../security.provider';
import { Role, User, UsersRoles } from 'src/database/models/security';
import { RolAsignateUsertDto, RolCreateDto, RolDto, RolUpdateDto, RolUserResultDto } from '../dtos';

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


  public override  async updateById(id: number, data: RolUpdateDto): RepoResult<RolDto | null> {
    try {

      const { codRol, name } = data;
      const isRoleExists = await this.isRoleExist(codRol,"", id);
      if(isRoleExists){
        return RequestResult.fail(new RepoError( `Code rol: ${codRol} or name rol: ${name}  already exists.`, HttpStatus.AMBIGUOUS));
      }
      
      await this.repositoryRole.update(data,{ where: { id }, returning: true });
            
      const result = {
        id,
        ...data
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
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {  [Op.eq]: `${name.toLowerCase()}`  }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('codRol')), {  [Op.eq]: `${code.toLowerCase()}`  }),
          
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
      const data =  await this.repositoryRole.findOne({ 
         where:   Sequelize.where(Sequelize.fn('lower', Sequelize.col('codRol')), {  [Op.eq]: `${codeRole.toLowerCase().trim()}`  })
       });
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
  * @param removerData  remover valores que no vengan el user id
  * @returns array of role and user by parameter code rol
  */
 public async asignateUsersByCodeRole(codeRole: string, data: RolAsignateUsertDto) : RepoResult<RolUserResultDto[]> {

  const transaction = await  this.repositoryRole.sequelize.transaction();
  try {

    const { uesrIds,  removerData } = data;
    const _usersRolesExists = await this.getRolesUsers(codeRole, null);

    if(_usersRolesExists.isFailure){
        throw new Error(_usersRolesExists.message);
    }

    const role = (await this.findByCode(codeRole)).getValue();
    let usersRolesExists: RolUserResultDto[] = _usersRolesExists.getValue();

    const usersRolesGuardar = uesrIds.filter(userId => !usersRolesExists.map(y => y.idUser).includes(userId))
                                          .map(userId => {   return { idUser: userId,   idRol: role.id  } as  UsersRoles  });


    if(removerData){
      const usersIdRolesDelete  =  usersRolesExists.filter(ur =>  uesrIds.includes(ur.idUser)).map(ur =>ur.idUser );
      await this.repositoryRoleUsersRoles.destroy({ 
        where: { idRol: role.id , idUser: [ ...usersIdRolesDelete ] },
        transaction: transaction
      });
    }

    for (const userRoleSave of usersRolesGuardar) {
      await this.repositoryRoleUsersRoles.create({  ...userRoleSave },{ transaction: transaction });
    }

    usersRolesExists = (await this.getRolesUsers(codeRole, null)).getValue();
    
    await transaction.commit();
    return RequestResult.ok(usersRolesExists);

  } catch (ex: any) {
    Logger.error(ex);
    await  transaction.rollback();
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
              // Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              // Sequelize.where(Sequelize.fn('lower', Sequelize.col('codRol')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('name')), {  [Op.like]: `%${options.searchs.trim()}%`  }),
              Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('name')), {  [Op.like]: `%${options.searchs.trim()}%`  }),
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

  /**
   * Get data about role and user
   * @param codeRol Codeo rol , Optional
   * @param userId User id, optional
   * @returns  RolUser
   */
  public async getRolesUsers(codeRol?: string, userId?: number): RepoResult<RolUserResultDto[]> {
    try {

      if(!codeRol && !userId){  throw new Error(`It is necessary to define at least one parameter`);  }

      let role: Role;

      if(codeRol){
        role = await this.repositoryRole.findOne({
          where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('codRol')), {  [Op.like]: `%${codeRol.toLowerCase()}%`  }),
          include: [
            {  model: User,  attributes: { exclude: ['password']  }  }
          ]
        });
      } else  if(userId){
        role = await this.repositoryRole.findOne({
          include: [
            {  model: User,  attributes: { exclude: ['password']  }, where:{  id: userId }  }
          ]
        });
      }


      if(!role){
        return RequestResult.fail(new RepoError('Role does not found', HttpStatus.NOT_FOUND));
      }
  
      let resultado: RolUserResultDto[] = [];
      if(role.users){
        resultado = role.users.map(r => {
          return {
              idRol: role.id,
              codeRol: role.codRol,
              rolName: role.name,
              idUser: r.id,
              username: r.username,
              firstname: r.firstname,
              lastname: r.lastname,
              userEmail: r.email,
              userActive: r.isActive
            };
        });
        
      }
      return RequestResult.ok(resultado);
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}


