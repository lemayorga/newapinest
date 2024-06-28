import { genSalt, hash } from 'bcrypt';
import sequelize from "sequelize/types/sequelize";
import { TableNameWithSchema } from 'sequelize';
import type { Migration } from '../migrator/umzugconf';
import { UserCreateDto } from 'src/api/security/dtos';


const tableRoleConfig = {
    tableName: 'role', 
    schema: 'security'
} as TableNameWithSchema;

const tableUserConfig = {
    tableName: 'user', 
    schema: 'security'
} as TableNameWithSchema;

const seedRoles = [
    { codRol: 'SADMIN', name: 'sadmin' },
    { codRol: 'ADMIN', name: 'admin' },
    { codRol: 'GUEST', name: 'guest' },
];

let user: UserCreateDto =  {
    username: `${process.env.DEFAULT_USER}`,
    email: `${process.env.DEFAULT_USER_EMAIL}`,
    password: `${process.env.DEFAULT_USER_PASSWORD}`,
    firstname: `${process.env.DEFAULT_USER}`,
    lastname: `${process.env.DEFAULT_USER}`,
} as  UserCreateDto;


async function encryptText(password: string, roundsSald: number = 10): Promise<string> {
    const salt = await genSalt(roundsSald);
    return await hash(password, salt);
}

export const up: Migration = async (context: sequelize) => {

	await context.getQueryInterface().bulkInsert(tableRoleConfig, seedRoles);

    user.password = await encryptText(user.password);
    await context.getQueryInterface().bulkInsert(tableUserConfig, [user]);
};


export const down: Migration = async (context: sequelize) => {

    await context.getQueryInterface().bulkDelete(tableRoleConfig, { 
        codRol: seedRoles.map(u => u.codRol) 
    });

    await context.getQueryInterface().bulkDelete(tableUserConfig, { 
        username: user.username
    });
};
