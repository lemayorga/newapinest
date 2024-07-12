import sequelize from "sequelize/types/sequelize";
import { ModelAttributes, QueryInterfaceCreateTableOptions, QueryTypes, TableName } from "sequelize";

export const testConnection = async(sequelize: sequelize) => {
  try {
      await sequelize.authenticate();
      console.log(`Connection to the database "${sequelize.config.database}" has been established successfully.`);
  } catch (error) {
      console.error(`Unable to connect to the database "${sequelize.config.database}":`, error);
  }
}

export const createExtensionDataBase =  async(sequelize: sequelize, extensionName:string) => {
    await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "${extensionName}";`);
}

export const existsSchemaDatabase = async (context: sequelize, schemaName: TableName) => {
  const result = await context.query( `SELECT SCHEMA_NAME  FROM INFORMATION_SCHEMA.SCHEMATA  WHERE SCHEMA_NAME = :schemaName`,
    {
      replacements: { schemaName },
      type: QueryTypes.SELECT,
    }
  );

  return result.length > 0;
}


export const createSchemaIfNotExists = async (sequelize: sequelize , schemaName: string) => {
    const existsSchema = await existsSchemaDatabase(sequelize,schemaName);
    if(!existsSchema){
      await sequelize.createSchema(schemaName, {  });
    }
}

export const dropSchemaIfExists = async (context: sequelize,schemaName: string) => {
  const existsSchema = await existsSchemaDatabase(context,schemaName);
  if(existsSchema){
    await context.dropSchema(schemaName, {  });
  }

  context.truncate()
}

export const existsTableDatabase = async (sequelize: sequelize, tableName: TableName) => {
  return await sequelize.getQueryInterface().tableExists(tableName);
}

export const createTableIfNotExists = async (sequelize: sequelize , tableName: TableName,
   attributes: ModelAttributes,
   options?: QueryInterfaceCreateTableOptions) => {
    
  const existsTable = await existsTableDatabase(sequelize,tableName);
  if(!existsTable){
    await sequelize.getQueryInterface().createTable(tableName,attributes,options);
  }
}

export const dropTableIfExists = async (sequelize: sequelize,tableName: TableName) => {
    const existsTable  = await existsTableDatabase(sequelize, tableName);
    if(!existsTable){
      await sequelize.getQueryInterface().dropTable(tableName);
    }
}

export const truncateTable = async(sequelize: sequelize, tableName: string)  => {

    const query = `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`;
    await sequelize.query(query);
}