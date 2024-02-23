import { Role } from "./role.entity";
import { User } from "./user.entity";
import { UsersRoles } from "./users_roles.entity";

export  const models = [
    UsersRoles,
    User,
    Role,

];

export {
    UsersRoles,
    User,
    Role
}