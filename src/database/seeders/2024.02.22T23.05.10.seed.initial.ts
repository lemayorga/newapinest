import { genSalt, hash } from 'bcrypt';
import sequelize from "sequelize/types/sequelize";
import { QueryTypes, TableNameWithSchema } from 'sequelize';
import type { Migration } from '../migrator/umzugconf';
import { UserCreateDto } from 'src/api/security/dtos';
import { codeRolSadmin, rolesDefault, userDefault } from '../../core/data.initial';
import { Role, User, UsersRoles } from '../models/security';


const tableRoleConfig = {  tableName: 'role',   schema: 'security' } as TableNameWithSchema;
const tableUserConfig = {tableName: 'user',    schema: 'security' } as TableNameWithSchema;
const tableUsersRolesConfig = {tableName: 'usersroles',    schema: 'security' } as TableNameWithSchema;

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

    user.password = await encryptText(user.password);

    Promise.all([
        context.getQueryInterface().bulkInsert(tableRoleConfig, seedRoles),
        context.getQueryInterface().bulkInsert(tableUserConfig, [user])
    ]).then(async() =>{

        const u :User[] =  await context.getQueryInterface().sequelize.query(
            `SELECT * FROM "${tableUserConfig.schema}"."${tableUserConfig.tableName}" WHERE username = ? `, {
              replacements: [ user.username ],
              type: QueryTypes.SELECT,
              plain: false, raw: true, logging: true
            })

        const r:Role[] =  await context.getQueryInterface().sequelize.query(
            `SELECT * FROM "${tableRoleConfig.schema}"."${tableRoleConfig.tableName}" as "r" WHERE r."codRol"  = ? `, {
                replacements: [ codeRolSadmin ],
                type: QueryTypes.SELECT,
                plain: false, raw: true, logging: true
            })            
            let userRoles = { idRol: r[0].id, idUser: u[0].id };
       await context.getQueryInterface().bulkInsert(tableUsersRolesConfig,[userRoles]);
    });







  
};


export const down: Migration = async (context: sequelize) => {

    await context.getQueryInterface().bulkDelete(tableRoleConfig, { 
        codRol: seedRoles.map(u => u.codRol) 
    });

    await context.getQueryInterface().bulkDelete(tableUserConfig, { 
        username: user.username
    });
};
