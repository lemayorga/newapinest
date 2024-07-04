import { SequelizeModule, SequelizeModuleOptions } from "@nestjs/sequelize";
import { ModelCtor, Sequelize } from "sequelize-typescript";
import { RolCreateDto } from "src/api/security/dtos";
import { Role, User, UsersRoles } from "src/database/models/security";
import { encryptText, randomInteger } from "src/utils";

const id = randomInteger(1,1000);
const dataBaseTestingConfig: SequelizeModuleOptions = {
    dialect: 'sqlite',
    storage: ':memory:',
    database: `DatabaseTemp_${id}`,
    logging: false,
    //logging: console.log,
    define: {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        timestamps: false
    }
};

export const rolesTestDefault = [
    {codRol: 'SADMIN', name: 'sadmin' },
    {codRol: 'ADMIN', name: 'admin' },
    {codRol: 'GUEST', name: 'guest' },
    {codRol: 'SALE', name: 'sales' },
    {codRol: 'MANAGER', name: 'manager' },
    {codRol: 'OPERATIONS', name: 'operations' },
];

export const userTestDefault =  {
    username: `${process.env.DEFAULT_USER}`,
    email: `${process.env.DEFAULT_USER_EMAIL}`,
    firstname: `${process.env.DEFAULT_USER}`,
    lastname: `${process.env.DEFAULT_USER}`,
};

/**
 * Generate for import SequelizeSqliteTestingModule
 */
export const SequelizeSqliteTestingModule = [
    SequelizeModule.forRoot(dataBaseTestingConfig)
];

/**
 * Create database Sqlite in memory
 * @param models specific models to add  context database
 * @param applySecurity Aply security models 
 * @param printInfo Show information about models mapping
 * @returns object database  Sequelize
 */
export async function createSqliteDB(models: ModelCtor[], applySecurity: boolean = false, printInfo: boolean = false) : Promise<Sequelize> {
    const memDB = new Sequelize(dataBaseTestingConfig);

   if(applySecurity){
    models = [
        ...models,
        Role,
        User,
        UsersRoles
    ];
   }
    memDB.addModels(models);
    await memDB.sync();

   if(applySecurity){
    await createRolesAndUsers();
   }

    printInfoMemDB(memDB, printInfo);
    return memDB;
}

async function createRolesAndUsers(){
    for(let role of rolesTestDefault){
        let recordRole =   await Role.create(role as RolCreateDto);
  
        if(recordRole.codRol == 'SADMIN'){
          const password = await encryptText (`${process.env.DEFAULT_USER_PASSWORD}`);
          let recordUser = await User.create({
              ...userTestDefault,
              password
          });
          await UsersRoles.create({
              idUser: recordUser.id,
              idRol: recordRole.id
          })
        }
      }
}

function printInfoMemDB (sequelize: Sequelize, printInfo: boolean = false): void {
    printInfo && console.log(`Database memory: ${sequelize.options.database} | Testing models: ${(Object.keys(sequelize.models).join(', '))}`);
}


//  
// https://jaygould.co.uk/2020-07-28-jest-sequelize-testing-dedicated-database/
// https://github.com/nestjs/nest/blob/master/sample/07-sequelize/src/users/users.service.spec.ts
