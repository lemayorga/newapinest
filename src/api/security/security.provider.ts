import { Role, User, UsersRoles } from "src/database/models/security";

export const PROVIDER_NAMES = {
    SECURITY_ROLE :  'SECURITY_ROLE',
    SECURITY_USER :  'SECURITY_USER',
    SECURITY_USERS_IN_ROLES :  'SECURITY_USERS_IN_ROLES',
}


export const SecurityProviders = [
    {
        provide: PROVIDER_NAMES.SECURITY_ROLE,
        useValue: Role,
    },
    {
        provide: PROVIDER_NAMES.SECURITY_USER,
        useValue: User,
    },
    {
        provide: PROVIDER_NAMES.SECURITY_USERS_IN_ROLES,
        useValue: UsersRoles,
    },
];