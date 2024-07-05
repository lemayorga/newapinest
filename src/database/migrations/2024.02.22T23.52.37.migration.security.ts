import type { MigrationFn } from 'umzug';
import sequelize from "sequelize/types/sequelize";
import { AddForeignKeyConstraintOptions, DataTypes, TableNameWithSchema } from 'sequelize';
import type { Migration } from '../migrator/umzugconf';

const schemaName = 'security';

const tableRoleConfig = {  tableName: 'role',  schema: schemaName } as TableNameWithSchema;

const tableUserConfig = {  tableName: 'user',   schema: schemaName } as TableNameWithSchema;

const tableRolesUserConfig = {  tableName: 'usersroles',   schema: schemaName } as TableNameWithSchema;



export const up: Migration = async (context: sequelize) => {
	await context.createSchema(schemaName, {  });

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
				field: 'is_active', 
				type: DataTypes.BOOLEAN , 
				defaultValue: true 
		   },
	});

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
};


export const down: Migration = async (context: sequelize) => {
	await context.getQueryInterface().dropTable(tableRolesUserConfig);
    await context.getQueryInterface().dropTable(tableRoleConfig);
	await context.getQueryInterface().dropTable(tableUserConfig);
	await context.getQueryInterface().dropSchema(schemaName);
};
