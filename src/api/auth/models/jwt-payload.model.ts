import { Role } from "src/database/models/security";

export interface JwtPayload {
    userId: number,
    userName: string;
    email: string;
    firstname: string;
    lastname: string;
    isActive: boolean;
    iat?: Date;
    roles?: Role[]
}