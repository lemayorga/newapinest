import { compare } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EnvCofigName } from "src/config/environment.validation";
import { UserLoginDto } from "../dtos/user-login.dto";
import { JwtPayload } from "../models/jwt-payload.model";
import { UserLoginResponseDto } from "../dtos/user-login-response.dto";
import { User } from "src/database/models/security";
import { UserService } from "../../security/services";

@Injectable()
export class AuthService {

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  public async login(signIn: UserLoginDto): Promise<any> {

      const userName = signIn.user.trim().toLowerCase();
      const password = signIn.password.trim();

      const user = await this.userService.findByUserNameOrEmail(userName);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const passwordValid  = await compare(password, user.password);
      if (!passwordValid) {
          throw new HttpException('Invalid email or password.', HttpStatus.BAD_REQUEST);
      }

      const token = await this.signToken(user);
      return new UserLoginResponseDto(user, token.access_token);
  }


  async signToken(user: User) {

    const payload: JwtPayload = {
      userId: user.id,
      userName: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      isActive: user.isActive,
      roles: [],
    };

    return {
      access_token: await this.jwtService.signAsync({
        ...payload
      },{
        secret: this.configService.get<string>(EnvCofigName.JWT_SECRET_KEY),
        expiresIn: this.configService.get<string>(EnvCofigName.ACCESS_TOKEN_EXPIRE_MINUTES),
      }),
    };
  }


  validateToken(token: string) {
    return this.jwtService.verify(token, {
        secret:  this.configService.get(EnvCofigName.JWT_SECRET_KEY)
    });
  }

}

// https://www.devxperiences.com/pzwp1/2022/03/19/jwt-and-passport-jwt-strategy-for-your-nestjs-rest-api-project/

// https://github.com/kentloog/nestjs-sequelize-typescript/blob/master/src/users/users.service.ts

// https://shpota.com/2022/07/16/role-based-authorization-with-jwt-using-nestjs.html

// https://blog.stackademic.com/passport-jwt-authentication-in-nestjs-e3313d04de49

// https://blog.logrocket.com/how-to-implement-jwt-authentication-nestjs/

// https://www.devxperiences.com/pzwp1/2022/03/19/jwt-and-passport-jwt-strategy-for-your-nestjs-rest-api-project/


// https://docs.nestjs.com/security/authentication
// https://codigoencasa.com/autenticacion-jwt-de-nestjs/
// https://www.google.com/search?q=facebook&rlz=1C1CHZN_enNI1017NI1017&oq=fa&gs_lcrp=EgZjaHJvbWUqBwgEEAAYjwIyBggAEEUYOTIGCAEQRRg7MgYIAhBFGDsyBggDEEUYOzIHCAQQABiPAjIGCAUQRRg8MgYIBhBFGD0yBggHEEUYPNIBCDM1NjZqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8