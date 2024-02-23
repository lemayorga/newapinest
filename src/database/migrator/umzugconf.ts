const { Umzug, SequelizeStorage } = require('umzug');
import { Sequelize } from 'sequelize';
import { dataBaseConfig } from '../database.config';


const sequelize = new Sequelize(dataBaseConfig);

export const migrator  = new Umzug({
    migrations: {
    //   glob: ['./src/database/migrations/*.ts', { cwd: __dirname }],
    glob: ['./src/database/migrations/*.ts'],
      resolve: ({ name, path, context }) => {
          const migration = require(path || '')
          return {
              name,
              up: async () => migration.up(context, Sequelize),
              down: async () => migration.down(context, Sequelize),
          }
      },
    },
    context: sequelize, 
    storageOptions: { sequelize },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});


const fakeApi = {
	async shutdownInternalService() {
		console.log('shutting down...');
	},
	async restartInternalService() {
		console.log('restarting!');
	},
};

migrator.on('beforeCommand', async () => {
	await fakeApi.shutdownInternalService();
});

migrator.on('afterCommand', async () => {
	await fakeApi.restartInternalService();
});

export type Migration = typeof migrator._types.migration;