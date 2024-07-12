import { RolUserResultDto } from "src/api/security/dtos";
export interface UserDataRequest {
    userId: string;
    username: string;
    email: string;
    roles:  RolUserResultDto[];
}