import { genSalt, hash } from 'bcrypt';
import sequelize from "sequelize/types/sequelize";
import { TableNameWithSchema } from 'sequelize';
import type { Migration } from '../migrator/umzugconf';
import { UserCreateDto } from 'src/api/security/dtos';
import { rolesDefault, userDefault } from '../../core/data.initial';


const tableRoleConfig = {
    tableName: 'role', 
    schema: 'security'
} as TableNameWithSchema;

const tableUserConfig = {
    tableName: 'user', 
    schema: 'security'
} as TableNameWithSchema;


const seedRoles =  [...rolesDefault];


let user: UserCreateDto = {
    ...userDefault,
    password: `${process.env.DEFAULT_USER_PASSWORD}`,
};

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
