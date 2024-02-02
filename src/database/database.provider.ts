import { ConfigService } from '@nestjs/config';
import { Sequelize, SequelizeOptions, } from 'sequelize-typescript';
import { EnvCofigName } from 'src/config/environment.validation';
import { PROVIDERS_NAMES } from 'src/core';
import { models as modelsCommun } from './models/commun';
import { models as modelSecurity } from "./models/security";

export const databaseProviders = [
  {
    provide: PROVIDERS_NAMES.SEQUELIZE,
    inject: [
      ConfigService
    ], //no worries for imports because you're using a global module
    useFactory: async (configService: ConfigService) => {

      let config : SequelizeOptions = {
        dialect: 'postgres',
        host: configService.get<string>(EnvCofigName.DB_HOST),
        port: configService.get<number>(EnvCofigName.DB_PORT),
        username: configService.get<string>(EnvCofigName.DB_USER),
        password: configService.get<string>(EnvCofigName.DB_PASSWORD),
        database: configService.get<string>(EnvCofigName.DB_NAME),
        define: {
            freezeTableName: true,
            createdAt: false,
            updatedAt: false,
            timestamps: false
        }
      };

      const sequelize = new Sequelize(config);

      sequelize.addModels([
        ...modelsCommun,
        ...modelSecurity
      ]);


      sequelize.authenticate().
      then(function(){ console.log("test database connected ...")  }).
      catch(function(error){console.log("Database catch block : "+ error) });

      return sequelize;
    },
  },
];