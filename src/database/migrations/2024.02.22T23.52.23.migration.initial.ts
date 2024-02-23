import type { MigrationFn } from 'umzug';
import sequelize from "sequelize/types/sequelize";
import { TableNameWithSchema } from 'sequelize';
import type { Migration } from '../migrator/umzugconf';

export const up: Migration = async (context: sequelize) => {
   await context.query(`
    CREATE SCHEMA IF NOT EXISTS commun;
 
    CREATE TABLE IF NOT EXISTS commun.catalogue 
    (
        id serial NOT NULL,
        "group" varchar(80) NOT NULL,
        value varchar(80) NOT NULL,
        is_active bool NOT NULL DEFAULT true,
        description varchar(255) NULL,
        CONSTRAINT catalogue_pkey PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS commun.company
    (
        id serial NOT NULL,
        "name" varchar(150) NOT NULL,
        is_active bool NOT NULL DEFAULT true,
        "companySuccessorId" int4 NULL,
        CONSTRAINT company_pkey PRIMARY KEY (id)
    );
`);
};


export const down: Migration = async (context: sequelize) => {
    await   context.query(`
	DROP TABLE commun.catalogue;
	DROP TABLE commun.company;
	DROP SCHEMA commun;
	`);
};
