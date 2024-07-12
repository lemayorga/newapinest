import 'dotenv/config';
import * as dotenv from 'dotenv';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { Envs, getEnvPath } from '../config';
import { randomInteger } from '../utils';

dotenv.config({ path: getEnvPath() })

export const dataBaseConfig: SequelizeModuleOptions = {
    dialect: (Envs.DIALECT || 'postgres') as Dialect, 
    host: `${Envs.DB_HOST}`,
    port: Envs.DB_PORT,
    username: `${Envs.DB_USER}`,
    password: `${Envs.DB_PASSWORD}`,
    database: `${Envs.DB_NAME}`,
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
