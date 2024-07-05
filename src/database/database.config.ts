import 'dotenv/config';
import * as dotenv from 'dotenv';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { getEnvPath } from '../config/enviroments';
import { randomInteger } from '../utils';

dotenv.config({ path: getEnvPath() })

export const dataBaseConfig: SequelizeModuleOptions = {
    dialect: (process.env.DIALECT || 'postgres') as Dialect, 
    host: `${process.env.DB_HOST}`,
    port: (+process.env.DB_PORT),
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    define: {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        timestamps: false
    },
    logQueryParameters: true,
    logging: console.log, //false
};


const id = randomInteger(1,1000);
export const dataBaseTestingConfig: SequelizeModuleOptions = {
    dialect: 'sqlite',
    storage: ':memory:',
    database: `DatabaseTemp_${id}`,
    logging: false, //console.log,
    define: {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        timestamps: false
    },
};


