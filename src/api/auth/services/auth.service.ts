import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EnvCofigName } from "src/config";
import { UserLoginDto } from "../dtos/user-login.dto";
import { JwtPayload } from "../models/jwt-payload.model";
import { UserLoginResponseDto } from "../dtos/user-login-response.dto";
import { User } from "src/database/models/security";
import { RolService, UserService } from "../../security/services";
import { compareEncryptText } from "src/utils";
@Injectable()
export class AuthService {

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService, 
    private userService: UserService,
    private roleService: RolService
  ) { }
  
  /**
   *  Login user
   * @param signIn object data username and password
   * @returns Return a object UserLoginResponseDto or UnauthorizedException if login is incorrect
   */
  public async login(signIn: UserLoginDto): Promise<UserLoginResponseDto> {

      const userName = signIn.user.trim().toLowerCase();
      const password = signIn.password.trim();

      const user = await this.userService.findByUserNameOrEmail(userName);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const passwordValid  = await compareEncryptText(password, user.password);
      if (!passwordValid) {
          throw new  HttpException('Invalid password, Access Denied', HttpStatus.BAD_REQUEST);
      }

      const tokens  = await this.signToken(user);
      return new UserLoginResponseDto(user, tokens .access_token, tokens .refresh_token);
  }


  async signToken(user: User) {
    const userRole = await this.roleService.getRolesUsers(null, user.id);

    const jwtPayload: JwtPayload = {
      userId: user.id,
      userName: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      isActive: user.isActive,
      roles: userRole.getValue() || [],
    };

   
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({ ...jwtPayload },{
        secret: this.configService.get<string>(EnvCofigName.JWT_SECRET_KEY),
        expiresIn: this.configService.get<string>(EnvCofigName.ACCESS_TOKEN_EXPIRE_MINUTES),
      }),
      this.jwtService.signAsync({... jwtPayload }, {
        secret: this.configService.get<string>(EnvCofigName.JWT_REFRESH_SECRET_KEY),
        expiresIn:  this.configService.get<string>(EnvCofigName.JWT_REFRESH_SECRET),
      })
    ]);
    
    return {
      access_token: at,
      refresh_token: rt,
    };
 /*
    return {
      access_token: await this.jwtService.signAsync({
        ...jwtPayload
      },{
        secret: this.configService.get<string>(EnvCofigName.JWT_SECRET_KEY),
        expiresIn: this.configService.get<string>(EnvCofigName.ACCESS_TOKEN_EXPIRE_MINUTES),
      }),
    }; */
  }


  validateToken(token: string) {
    return this.jwtService.verify(token, {
        secret:  this.configService.get(EnvCofigName.JWT_SECRET_KEY)
    });
  }

}