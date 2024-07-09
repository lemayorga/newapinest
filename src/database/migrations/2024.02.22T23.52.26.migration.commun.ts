import sequelize from "sequelize/types/sequelize";
import { DataTypes, TableNameWithSchema  } from 'sequelize';
import type { Migration } from '../migrator/umzugconf';
import { createSchemaIfNotExists, dropSchemaIfExists, dropTableIfExists, existsTableDatabase } from '../database.extension';

const schemaName = 'commun';
const tableCatalogue = {  tableName: 'catalogue',  schema: schemaName } as TableNameWithSchema;
const tableCompany = {  tableName: 'company',  schema: schemaName } as TableNameWithSchema;

export const up: Migration = async (context: sequelize) => {

    await createSchemaIfNotExists(context, schemaName);

    if(!await existsTableDatabase(context, tableCatalogue)){
        await context.getQueryInterface().createTable(tableCatalogue,
            {
                id: { 
                    type: DataTypes.INTEGER, 
                    autoIncrement: true,   
                    primaryKey: true,  
                },
                group: {
                     allowNull: false ,  
                     type: DataTypes.STRING(80) ,  
                     unique: true,
                     validate: { max: 80 }
                },
                value: {
                     allowNull: false, 
                     type: DataTypes.STRING(80) , 
                     unique: true, 
                     validate: { max: 80 }
                },
                description: {
                    allowNull: false, 
                    type: DataTypes.STRING(255) , 
                    validate: { max: 255 }
               },
                isActive: {
                    allowNull: false, 
                    type: DataTypes.BOOLEAN , 
                    defaultValue: true 
               },
            });

    }

    if(!await existsTableDatabase(context, tableCompany)){
        await context.getQueryInterface().createTable(tableCompany,
            {
                id: { 
                    type: DataTypes.INTEGER, 
                    autoIncrement: true,   
                    primaryKey: true,  
                },
                name: {
                     allowNull: false ,  
                     type: DataTypes.STRING(150) ,  
                     validate: { max: 150 }
                },
                isActive: {
                    allowNull: false, 
                    type: DataTypes.BOOLEAN , 
                    defaultValue: true 
               },
               companySuccessorId: {
                   allowNull: true, 
                   type: DataTypes.INTEGER
               },
        });
    }


};

export const down: Migration = async (context: sequelize) => {
    await dropTableIfExists(context, tableCatalogue);
    await dropTableIfExists(context, tableCompany);
    await dropSchemaIfExists(context, schemaName);
};


