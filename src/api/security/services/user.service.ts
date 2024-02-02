import { genSalt, hash, compare } from 'bcrypt';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Op } from 'sequelize';
import { PROVIDERS_NAMES }from 'src/core';
import { RepoResult, RepoError, RequestResult } from 'src/api/shared/models';
import { RepositoryCrudService } from 'src/api/shared/services';
import { User } from 'src/database/models/security';
import { ChangePasswordUserDto, UserCreateDto, UserDto, UserUpdateDto } from '../dtos';

@Injectable()
export class UserService  extends RepositoryCrudService<User, UserDto, UserCreateDto , UserUpdateDto> {

  constructor(
    @Inject(PROVIDERS_NAMES.SECURITY_USER) private readonly repository: typeof User
  ){
    super(User);
  }

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
      data =  {
        ...data,
        username: data.username.trim().toLowerCase(),
        email: data.email.trim().toLowerCase(),
      }

      const userExist = await this.findByUserNameOrEmail(data.username);
      if(userExist) {
        return RequestResult.message(`User: ${data.username} already exists in the database.`, {  
          username: data.username,
          email: data.email,
        } as any);
      }

      data.password = await this.encryptPassword(data.password);

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

  public async updateById(idUser: number, data: UserUpdateDto): RepoResult<UserDto | null> {
    try {
      const user = await this.repository.findOne<User>({  where: {  id: idUser   }, raw : true , nest : true,  });
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      user.firstname = data.firstname || user.firstname;
      user.lastname = data.lastname || user.lastname;
      user.email = data.email || user.email;
      user.isActive = data.isActive || user.isActive;

      const model = await user.save();
      const { password, ...result } = model;

      return RequestResult.ok(result);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  public async changePassword(changePassword: ChangePasswordUserDto): RepoResult<UserDto | null> {
    try{

      const { username,  currentPassword, newPassword,  comparePasswords } =  changePassword;
      const user = await this.findByUserNameOrEmail(username);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      if(comparePasswords) {
        const passwordValid  = await compare(currentPassword, user.password);
        if (!passwordValid) {
            throw new HttpException('Invalid email or password.', HttpStatus.BAD_REQUEST);
        }
      }

      const isEqualNewPassworAndOldPassword  = await compare(newPassword, user.password);
      if(isEqualNewPassworAndOldPassword){
          throw new HttpException('The new password cannot be identical to the existing password.', HttpStatus.BAD_REQUEST);
      }

      const newPasswordEncript = await this.encryptPassword(newPassword);
      user.password =  newPasswordEncript;

      const model = await user.save();
      const { password , ...result } = model;

      return RequestResult.ok(result);

    } catch (ex: any) {
      Logger.error(ex);
      return RequestResult.fail(new RepoError(ex.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  private async encryptPassword(password: string){
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
}


// https://github.com/kentloog/nestjs-sequelize-typescript/blob/master/src/users/users.service.ts