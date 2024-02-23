import { ConfigService } from '@nestjs/config';
import { Sequelize, SequelizeOptions, } from 'sequelize-typescript';
import { EnvCofigName } from 'src/config/environment.validation';
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
       
     //  const sequelize = new Sequelize(dataBaseConfig);
      
     console.log(sequelize)
     console.log(dataBaseConfig)

      sequelize.addModels([
        ...modelsCommun,
        ...modelSecurity
      ]);


      sequelize.authenticate()
          .then(function(){ console.log("test database connected ...")  })
          .catch(function(error){console.log("Database catch block : "+ error) });

      return sequelize;
    },
  },
];