import * as dotenv from 'dotenv';
import { getEnvPath } from '../config';

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
    username: `${process.env.DEFAULT_USER}`,
    email: `${process.env.DEFAULT_USER_EMAIL}`,
    firstname: `${process.env.DEFAULT_USER}`,
    lastname: `${process.env.DEFAULT_USER}`,
};


export const userLoginSadmin = {
    user: `${process.env.DEFAULT_USER_EMAIL}`,
    password: `${process.env.DEFAULT_USER_PASSWORD}`
};