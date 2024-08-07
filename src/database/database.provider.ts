import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { dataBaseConfig } from './database.config';
import { models as modelsCommun } from './models/commun';
import { models as modelSecurity } from "./models/security";
import { colours } from 'src/core';

export const PROVIDER_NAMES = {
  SEQUELIZE: 'SEQUELIZE',
}

export const sequelize = new Sequelize(dataBaseConfig);

export const databaseProviders = [
  {
    provide: PROVIDER_NAMES.SEQUELIZE,
    inject: [   ConfigService  ], 
    useFactory: async (configService: ConfigService) => {
      sequelize.addModels([
        ...modelsCommun,
        ...modelSecurity
      ]);
      return sequelize;
    },
  },
];


export async function testConnection() {
  try {
      await sequelize.authenticate();
      console.log(colours.BgBlack, colours.FgGreen,`Connection to the database "${sequelize.config.database}" has been established successfully.` , colours.reset);
  } catch (error) {
      console.error(`Unable to connect to the database "${sequelize.config.database}":`, error);
  }
}

export async function syncModels() {
  try {
      await sequelize.sync();
      console.log("Models have been synchronized with the database.");
  } catch (error) {
      console.error("Unable to sync models with the database:", error);
  }
}
