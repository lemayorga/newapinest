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