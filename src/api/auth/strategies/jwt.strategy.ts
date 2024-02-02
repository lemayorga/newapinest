import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvCofigName } from "src/config/environment.validation";
import { JwtPayload } from "../models/jwt-payload.model";
import { UserService } from "../../security/services";
import { UserDataRequest } from "../models";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    
    constructor(
        private readonly configService: ConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get(EnvCofigName.JWT_SECRET_KEY),
        });
    }


    async validate(payload:JwtPayload): Promise<UserDataRequest> {
    
        const { email, userName , roles } = payload;
        const user = await this.userService.findByUserNameOrEmail(userName);


        if(!user)
         throw new UnauthorizedException('Token not valid.');

        if(!user.isActive)
         throw new UnauthorizedException('User is inactive, talk with an admin.');

        const userRquest: UserDataRequest = {
            userId: user.id.toString(),
            username: userName,
            email: email,
            roles: roles
        }
        return userRquest;
    }
}