import { Role } from "src/database/models/security";

export interface UserDataRequest {
    userId: string;
    username: string;
    email: string;
    roles: Role[];
}