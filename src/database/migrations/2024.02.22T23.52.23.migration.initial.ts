import sequelize from "sequelize/types/sequelize";
import type { Migration } from '../migrator/umzugconf';
import { dataBaseConfig } from "../database.config";

const databaseName = `${dataBaseConfig.database}`;


export const up: Migration = async (context: sequelize) => {
//   await context.getQueryInterface().createDatabase(databaseName);
    //await createExtensionDataBase( context,'unaccent ');

};

export const down: Migration = async (context: sequelize) => {
    // await context.getQueryInterface().dropDatabase(databaseName);
};


