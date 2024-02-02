import { Reflector } from "@nestjs/core";
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserDataRequest } from "../models";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtServ: JwtService
   ) {}


   async canActivate(context: ExecutionContext):  Promise<boolean> {
        try {
            // const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());    

            // if(!validRoles) return true;
            // if(validRoles.length  === 0 )  return true;

            const request = context.switchToHttp().getRequest();

            const { authorization }: any = request.headers;
            if (!authorization || authorization.trim() === '') {
                throw new UnauthorizedException('Please provide token');
            }

            const authToken = authorization.replace(/bearer/gim, '').trim();

            // const resp = await this.validateToken(authToken);
            // request.decodedData = resp;

            const user: UserDataRequest = request.user;

            if(!user)
            throw new BadRequestException('User not found');

            // if(validRoles.includes(user.codeRole))
            // return true;
            
            // throw new ForbiddenException(`User: '${user.username}' need a valid role: [ ${validRoles.join(', ')} ]`);
            
            return true;

        } catch (error) {
            console.log('auth error - ', error.message);
            throw new ForbiddenException(error.message || 'session expired! Please sign In');
        }
    }

    // validateToken(token: string) {
    //     return this.jwtServ.verify(token, {
    //         secret : process.env.JWT_SECRET_KEY
    //     });
    // }
}

