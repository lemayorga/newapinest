import * as dotenv from 'dotenv';
import { Envs, getEnvPath } from '../config';

dotenv.config({ path: getEnvPath() })

export const codeRolSadmin = 'SADMIN';

export const rolesDefault = [
    {codRol: 'SADMIN', name: 'sadmin' },
    {codRol: 'ADMIN', name: 'admin' },
    {codRol: 'GUEST', name: 'guest' },
    {codRol: 'SALE', name: 'sales' },
    {codRol: 'MANAGER', name: 'manager' },
    {codRol: 'OPERATIONS', name: 'operations' },
];

export const userDefault =  {
    username: `${Envs.DEFAULT_USER}`,
    email: `${Envs.DEFAULT_USER_EMAIL}`,
    firstname: `${Envs.DEFAULT_USER}`,
    lastname: `${Envs.DEFAULT_USER}`,
};


export const userLoginSadmin = {
    user: `${Envs.DEFAULT_USER_EMAIL}`,
    password: `${Envs.DEFAULT_USER_PASSWORD}`
};