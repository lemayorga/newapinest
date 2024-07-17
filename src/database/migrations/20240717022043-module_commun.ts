'use strict';
import sequelize from "sequelize/types/sequelize";
import { QueryInterface, DataTypes, TableNameWithSchema } from 'sequelize';

const schemaName = 'commun';
const tableCatalogue = {  tableName: 'catalogue',  schema: schemaName } as TableNameWithSchema;
const tableCompany = {  tableName: 'company',  schema: schemaName } as TableNameWithSchema;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface:QueryInterface,Sequelize: sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  

    await queryInterface.createTable(tableCatalogue,
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
        await queryInterface.createTable(tableCompany,
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

  },

  async down (queryInterface:QueryInterface,Sequelize:sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable(tableCatalogue);
    await queryInterface.dropTable(tableCompany);

  }
};
