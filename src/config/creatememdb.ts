import { SequelizeModule, SequelizeModuleOptions } from "@nestjs/sequelize";
import { ModelCtor, Sequelize } from "sequelize-typescript";

const dataBaseTestingConfig: SequelizeModuleOptions = {
    dialect: 'sqlite',
    storage: ':memory:',
    database: `DatabaseTemp_`,
    logging: false,
    // logging: console.log,
    define: {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        timestamps: false
    }
};

export async function createSqliteDB(models: ModelCtor[]) : Promise<Sequelize> {
    const memDB = new Sequelize(dataBaseTestingConfig);
    memDB.addModels(models);
    await memDB.sync();
    printInfoMemDB(memDB);
    return memDB;
}

export const SequelizeSqliteTestingModule = () => [
    SequelizeModule.forRoot(dataBaseTestingConfig),
    // SequelizeModule.forFeature([...models]),
];


function printInfoMemDB (sequelize: Sequelize, printInfo: boolean = false): void {

    printInfo && console.log(`Database memory: ${sequelize.options.database} | Testing models:  ${(Object.keys(sequelize.models).join(', '))}`);
}

//  
// https://jaygould.co.uk/2020-07-28-jest-sequelize-testing-dedicated-database/
// https://github.com/nestjs/nest/blob/master/sample/07-sequelize/src/users/users.service.spec.ts
