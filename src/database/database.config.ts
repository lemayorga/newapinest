import { SequelizeModuleOptions } from '@nestjs/sequelize';
import 'dotenv/config';

export const dataBaseConfig: SequelizeModuleOptions = {
    dialect: 'postgres',
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
    }
};