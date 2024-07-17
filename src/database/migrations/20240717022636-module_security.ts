'use strict';
import sequelize from "sequelize/types/sequelize";
import { QueryInterface, DataTypes, TableNameWithSchema, AddForeignKeyConstraintOptions } from 'sequelize';

const schemaName = 'security';
const tableRoleConfig = {  tableName: 'role',  schema: schemaName } as TableNameWithSchema;
const tableUserConfig = {  tableName: 'user',   schema: schemaName } as TableNameWithSchema;
const tableRolesUserConfig = {  tableName: 'usersroles',   schema: schemaName } as TableNameWithSchema;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface:QueryInterface,Sequelize: sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  
    await queryInterface.createTable(tableRoleConfig,
			{
				id: { 
					type: DataTypes.INTEGER, 
					autoIncrement: true,   
					primaryKey: true,  
				},
				codRol: {
					 allowNull: false ,  
					 field: 'codRol', 
					 type: DataTypes.STRING(100) ,  
					 unique: true,
					validate: { max: 100 }
				},
				name: {
					 allowNull: false, 
					 field: 'name', 
					 type: DataTypes.STRING(100) , 
					 unique: true, 
					 validate: { max: 100 }
				},
			});

        await queryInterface.createTable(tableUserConfig,
          {
              id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true,   
                primaryKey: true,  
              },
              username: {
                allowNull: false ,  
                type: DataTypes.STRING(100) ,  
                unique: true,
                validate: { min: 3, max: 50 }
              },
              email: {
                allowNull: false ,  
                type: DataTypes.STRING(100) ,  
                unique: true,
                validate: {  max: 100 , isEmail: true }
              },
              firstname: {
                allowNull: false ,  
                type: DataTypes.STRING(100) ,  
                validate: { min: 3, max: 100 }
              },
              lastname: {
                allowNull: false ,  
                type: DataTypes.STRING(100) ,  
                validate: { min: 3, max: 100 }
              },
              password: {
                allowNull: false ,  
                type: DataTypes.STRING(100) ,  
                validate: {  max: 100 }
              },
              isActive: {
                allowNull: false, 
                type: DataTypes.BOOLEAN , 
                defaultValue: true 
               },
          });


          await queryInterface.createTable(tableRolesUserConfig,
            {
                id: { 
                  type: DataTypes.INTEGER, 
                  autoIncrement: true,   
                  primaryKey: true,  
                },
                idUser: {
                  allowNull: false ,  
                  field: 'idUser', 
                  type: DataTypes.INTEGER,  
                },
                idRol: {
                  allowNull: false, 
                  field: 'idRol', 
                  type: DataTypes.INTEGER,	
                },
            }).then(() => {
               queryInterface.addConstraint(tableRolesUserConfig,
              {
                type: 'foreign key',
                name: 'FK_usersroless_rol',
                fields: ['idRol'], 
                onDelete: 'CASCADE',
                references: { table: tableRoleConfig, field: 'id' }
              } as AddForeignKeyConstraintOptions);
          
               queryInterface.addConstraint(tableRolesUserConfig,
              {
                type: 'foreign key',
                name: 'FK_usersroles_user',
                fields: ['idUser'], 
                onDelete: 'CASCADE',
                references: { table: tableUserConfig, field: 'id' }
              } as AddForeignKeyConstraintOptions);
            });          

  },

  async down (queryInterface:QueryInterface,Sequelize:sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable(tableRolesUserConfig);
    await queryInterface.dropTable(tableRoleConfig);
    await queryInterface.dropTable(tableUserConfig);
  }
};
