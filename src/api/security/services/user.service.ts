import { use } from 'passport';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { PROVIDER_NAMES } from '../security.provider';
import { encryptText, compareEncryptText} from 'src/utils';
import { RepoResult, RepoError, RequestResult, PageOptionsDto, PageMeta, SortOrder } from 'src/api/shared/models';
import { PaginationService, RepositoryCrudService } from 'src/api/shared/services';
import { User } from 'src/database/models/security';
import { ChangePasswordUserDto, UserCreateDto, UserDto, UserUpdateDto } from '../dtos';

@Injectable()
export class UserService  extends RepositoryCrudService<User, UserDto, UserCreateDto , UserUpdateDto> {

  constructor(
    @Inject(PROVIDER_NAMES.SECURITY_USER) private readonly repository: typeof User,
    private paginationService: PaginationService
  ){
    super(User);
  }

  /**
   * Finding user por userName or email
   * @param user userName or userEmail
   * @returns User 
   */
  public async findByUserNameOrEmail(user: string): Promise<User>  {
    user =  user.trim().toLowerCase();
    const data =  await this.repository.findOne({ where: { 
      [Op.or]: [ 
        { username: { [Op.eq]: user } } ,
        { email: { [Op.eq]: user } }
      ]
    }});

    return data;
  }

  public override async create(data: UserCreateDto): RepoResult<UserDto | null> {
    try {
      const { password }  = data;
      data =  {
        ...data,
        username: data.username.trim().toLowerCase(),
        email: data.email.trim().toLowerCase(),
        password: await encryptText (data.password)
      }

      const userExist = await this.findByUserNameOrEmail(data.username);
      if(userExist) {
        return RequestResult.message(`User: ${data.username} already exists in the database.`, {  
          username: data.username,
          email: data.email,
        } as any);
      }
  
      data.password = await encryptText (password); //encryptPassword


      const model =  await this.repository.create(data,{ returning: true, raw : true , nest : true });
      const result : UserDto = {
          id: model.id,  
          username: model.username,
          firstname: model.firstname,
          lastname: model.lastname,
          email: model.email,
          isActive: model.isActive
      };

      return RequestResult.ok(result);
    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public override async updateById(id: number, data: UserUpdateDto): RepoResult<UserDto | null> {
    try {
      const user = await this.repository.findOne<User>({  where: {  id  }, raw : false , nest : true,  });
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      await this.repository.update({
        ...data
      }, {  where: {  id  } });

      const result : UserDto = {
        id,
        ...data
      };

      return RequestResult.ok(result);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async changePassword(changePassword: ChangePasswordUserDto): RepoResult<UserDto | null> {
    try{

      const { username,  currentPassword, newPassword,  compareCurrentPasswords } =  changePassword;
      const user = await this.findByUserNameOrEmail(username);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      if(compareCurrentPasswords) {
        const passwordValid  = await compareEncryptText(currentPassword, user.password);
        if (!passwordValid) {
            return RequestResult.fail(new RepoError('The current password is incorrect', HttpStatus.BAD_REQUEST));
        }
      }

      const isEqualNewPassworAndOldPassword  = await compareEncryptText(newPassword, user.password);
      if(isEqualNewPassworAndOldPassword){
          return RequestResult.fail(new RepoError('The new password cannot be identical to the existing password.', HttpStatus.BAD_REQUEST));
      }

      const newPasswordEncript = await encryptText(newPassword); //encryptPassword

      await this.repository.update({  password :  newPasswordEncript },{  where: {  id: user.id } });

      const result : UserDto = {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isActive: user.isActive
      };

      return RequestResult.ok(result);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async paginate(options: PageOptionsDto, order_by?: string) {
    let paginationOptions: PageMeta = new PageMeta(options.take, options.page);

     if (options.searchs) {
       paginationOptions.searchs = {
          where: {
            [Op.or]:[
              // Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              // Sequelize.where(Sequelize.fn('lower', Sequelize.col('firstname')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              // Sequelize.where(Sequelize.fn('lower', Sequelize.col('lastname')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              // Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), {  [Op.like]: `%${options.searchs.toLowerCase()}%`  }),
              Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('username')), {  [Op.like]: `%${options.searchs.trim()}%`  }),
              Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('firstname')), {  [Op.like]: `%${options.searchs.trim()}%`  }),
              Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('lastname')), {  [Op.like]: `%${options.searchs.trim()}%`  }),
              Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('email')), {  [Op.like]: `%${options.searchs.trim()}%`  }),
            ]
           }
       };
     }

     const transform = (records: User[]): UserDto[] => {
       const result: UserDto[] = records.map(record => {
           return   {
              id : record.id,
              username: record.username,
              firstname: record.firstname,
              lastname: record.lastname,
              email: record.email,
              isActive: record.isActive,
           } 
       }) ;
       return result;
    }

     if (order_by && options.order) {
       paginationOptions.order.push([order_by, options.order]);
     }else{
       paginationOptions.order.push(['id', options.order ?? SortOrder.ASC]);
     }

     const result = await this.paginationService.paginante<UserDto>(User, paginationOptions, transform);
     return result;
 }
}

