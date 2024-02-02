import { PROVIDERS_NAMES } from 'src/core';
import { Role, User, UsersRoles } from "src/database/models/security";

export const SecurityProviders = [
    {
        provide: PROVIDERS_NAMES.SECURITY_ROLE,
        useValue: Role,
    },
    {
        provide: PROVIDERS_NAMES.SECURITY_USER,
        useValue: User,
    },
    {
        provide: PROVIDERS_NAMES.SECURITY_USERS_IN_ROLES,
        useValue: UsersRoles,
    },
];