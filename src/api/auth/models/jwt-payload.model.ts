import { RolUserResultDto } from "src/api/security/dtos";


export interface JwtPayload {
    userId: number,
    userName: string;
    email: string;
    firstname: string;
    lastname: string;
    isActive: boolean;
    iat?: Date;
    roles?: RolUserResultDto[]
}