import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators';
import { UserDataRequest } from '../models';

@Injectable()
export class UerRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());    

    if(!validRoles) return true;
    if(validRoles.length  === 0 )  return true;

    const req = context.switchToHttp().getRequest();
    const user: UserDataRequest = req.user;

    if(!user)
       throw new BadRequestException('User not found');

    // if(validRoles.includes(user.codeRole))
    //   return true;
    
    // throw new ForbiddenException(`User: '${user.username}' need a valid role: [ ${validRoles.join(', ')} ]`);
    
     return true;
  }
}