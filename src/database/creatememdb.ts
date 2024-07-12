import { SequelizeModule } from "@nestjs/sequelize";
import { ModelCtor, Sequelize } from "sequelize-typescript";
import { RolCreateDto } from "src/api/security/dtos";
import { Role, User, UsersRoles } from "src/database/models/security";
import { Envs } from "src/config";
import { encryptText } from "src/utils";
import { dataBaseTestingConfig } from "./database.config";
import { codeRolSadmin, rolesDefault, userDefault } from "src/core";


export const SequelizeSqliteTestingModule = [
    SequelizeModule.forRoot(dataBaseTestingConfig)
];

export type  DBMemoryTestOptions = {
    applySecurity?: boolean;
    printInfo?: boolean;
    logging?: boolean
} 

export async function createSqliteDB(models: ModelCtor[], option?: DBMemoryTestOptions) : Promise<Sequelize> {

  const options: DBMemoryTestOptions  = 
  {
    applySecurity: option?.applySecurity || false,
    printInfo: option?.printInfo || false,
    logging: option?.logging || false
  };


  if(options.applySecurity){
    models = [ ...models,  Role,  User, UsersRoles ];
  }

  dataBaseTestingConfig.logging = options.logging;
  
  const memDB = new Sequelize(dataBaseTestingConfig);
  
  memDB.addModels(models);


  await memDB.sync({ force: true });

  if(options.applySecurity){
     await createRolesAndUsers();
  }

  options.printInfo && console.log(`Database memory: ${memDB.options.database} | Testing models: ${(Object.keys(memDB.models).join(', '))}`);

  return memDB;
}

// async function createRolesAndUsers(){
const createRolesAndUsers = async () => { 
    for(let role of rolesDefault){
        let recordRole =   await Role.create(role as RolCreateDto);
  
        if(recordRole.codRol == codeRolSadmin){
          const password = await encryptText (`${Envs.DEFAULT_USER_PASSWORD}`);
          let recordUser = await User.create({
              ...userDefault,
              password
          });
          await UsersRoles.create({
              idUser: recordUser.id,
              idRol: recordRole.id
          })
        }
      }
}

//  
// https://jaygould.co.uk/2020-07-28-jest-sequelize-testing-dedicated-database/
// https://github.com/nestjs/nest/blob/master/sample/07-sequelize/src/users/users.service.spec.ts
