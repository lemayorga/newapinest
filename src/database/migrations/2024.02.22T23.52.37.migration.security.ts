import sequelize from "sequelize/types/sequelize";
import { AddForeignKeyConstraintOptions, DataTypes, TableNameWithSchema } from 'sequelize';
import type { Migration } from '../migrator/umzugconf';
import { createSchemaIfNotExists, dropSchemaIfExists, dropTableIfExists, existsTableDatabase } from '../database.extension';

const schemaName = 'security';
const tableRoleConfig = {  tableName: 'role',  schema: schemaName } as TableNameWithSchema;
const tableUserConfig = {  tableName: 'user',   schema: schemaName } as TableNameWithSchema;
const tableRolesUserConfig = {  tableName: 'usersroles',   schema: schemaName } as TableNameWithSchema;

export const up: Migration = async (context: sequelize) => {
    await createSchemaIfNotExists(context, schemaName);

    if(!await existsTableDatabase(context, tableRoleConfig)){
		await context.getQueryInterface().createTable(tableRoleConfig,
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
	}

    if(!await existsTableDatabase(context, tableUserConfig)){
		await context.getQueryInterface().createTable(tableUserConfig,
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
	}

    if(!await existsTableDatabase(context, tableRolesUserConfig)){
		await context.getQueryInterface().createTable(tableRolesUserConfig,
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
			context.getQueryInterface().addConstraint(tableRolesUserConfig,
			{
				type: 'foreign key',
				name: 'FK_usersroless_rol',
				fields: ['idRol'], 
				onDelete: 'CASCADE',
				references: { table: tableRoleConfig, field: 'id' }
			} as AddForeignKeyConstraintOptions);
	
			context.getQueryInterface().addConstraint(tableRolesUserConfig,
			{
				type: 'foreign key',
				name: 'FK_usersroles_user',
				fields: ['idUser'], 
				onDelete: 'CASCADE',
				references: { table: tableUserConfig, field: 'id' }
			} as AddForeignKeyConstraintOptions);
		});
	}
};


export const down: Migration = async (context: sequelize) => {
	await dropTableIfExists(context, tableRolesUserConfig);
	await dropTableIfExists(context, tableRoleConfig);
	await dropTableIfExists(context, tableUserConfig);
    await dropSchemaIfExists(context, schemaName);
};
