import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { models as modelsCommun } from './models/commun';
import { models as modelSecurity } from "./models/security";
import { dataBaseConfig } from './database.config';

export const PROVIDER_NAMES = {
  SEQUELIZE: 'SEQUELIZE',
}

export const databaseProviders = [
  {
    provide: PROVIDER_NAMES.SEQUELIZE,
    inject: [
      ConfigService
    ], 
    useFactory: async (configService: ConfigService) => {

     const sequelize = new Sequelize(dataBaseConfig);

      sequelize.addModels([
        ...modelsCommun,
        ...modelSecurity
      ]);

      sequelize.authenticate()
          .then(() =>{ console.log("test database connected ...")  })
          .catch((error) => {console.log("Database catch block : "+ error) });

      return sequelize;
    },
  },
];