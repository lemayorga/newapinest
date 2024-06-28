// import 'dotenv/config';
import * as path from 'path';
import * as childProcess from 'child_process';
import { Sequelize } from 'sequelize-typescript';
import { dataBaseConfig } from './../database.config';
const { Umzug, SequelizeStorage } = require('umzug');

const DB_NAME =  `${dataBaseConfig.database}`;
const DB_USER = `${dataBaseConfig.username}`;
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

const seeder = new Umzug({
	migrations: {
        // glob: ['./src/database/seeders/*.ts', { cwd: __dirname }],
        glob: ['./src/database/seeders/*.ts'],
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
    storageOptions: {
        sequelize: sequelize,
        modelName: 'SequelizeSeeders' // Or whatever you want to name the seeder storage table
      },
	storage: new SequelizeStorage({ sequelize }),
	logger: console,
});


function logUmzugEvent(eventName) {
  return function(name, migration) {
      console.log(`${name} ${eventName}`);
  };
}
migrator.on('migrating', logUmzugEvent('migrating'));
migrator.on('migrated', logUmzugEvent('migrated'));
migrator.on('reverting', logUmzugEvent('reverting'));
migrator.on('reverted', logUmzugEvent('reverted'));


function cmdStatus() {
  let result: any = {};

  return migrator 
      .executed()  // returns an array of all already executed migrations
      .then(executed => {
          result.executed = executed;
          return migrator.pending();
      })
      .then(pending => {
          result.pending = pending;
          return result;
      })
      .then(({ executed, pending }) => {

      

          executed = executed.map(m => {
              m.file =  m.path;
              m.name = path.basename(m.file, '.ts');
              return m;
          });
          pending = pending.map(m => {
              m.file =  m.path;
              m.name = path.basename(m.file, '.ts');
              return m;
          });

          const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
          const status = {
              current: current,
              executed: executed.map(m => m.file),
              pending: pending.map(m => m.file)
          };

          console.log(JSON.stringify(status, null, 2));

          return { executed, pending };
      });
}

function cmdMigrate() {
  return migrator .up();
}

function cmdSeeders() {
    return seeder.up();
}
  

function cmdMigrateNext() {
  return cmdStatus().then(({ executed, pending }) => {
      if (pending.length === 0) {
          return Promise.reject(new Error('No pending migrations'));
      }
      const next = pending[0].name;
      return migrator .up({ to: next });
  });
}

function cmdReset() {
  return migrator .down({ to: 0 });
}


function cmdResetPrev() {
  return cmdStatus().then(({ executed, pending }) => {
      if (executed.length === 0) {
          return Promise.reject(new Error('Already at initial state'));
      }
      const prev = executed[executed.length - 1].name;
      return migrator.down({ to: prev });
  });
}

function cmdHardReset() {
  return new Promise<void>((resolve, reject) => {
      setImmediate(() => {
          try {
              console.log(`dropdb ${DB_NAME}`);
              childProcess.spawnSync(`dropdb ${DB_NAME}`);
              console.log(`createdb ${DB_NAME} --username ${DB_USER}`);
              childProcess.spawnSync(`createdb ${DB_NAME} --username ${DB_USER}`);
              resolve();
          } catch (e) {
              console.log(e);
              reject(e);
          }
      });
  });
}

const cmd =  (process.argv[2] || '').trim();
let executedCmd;

console.log(`Execute to database ${DB_NAME}`);
console.log(`${cmd.toUpperCase()} BEGIN`);

switch (cmd) {
    case 'status':
        executedCmd = cmdStatus();
        break;

    case 'up':    //Applies pending migrations
    case 'migrate':
        executedCmd = cmdMigrate();
        break;

    case 'next':
    case 'migrate-next':
        executedCmd = cmdMigrateNext();
        break;

    case 'down':  // Revert migrations
    case 'reset':
        executedCmd = cmdReset();
        break;

    case 'prev':
    case 'reset-prev':
        executedCmd = cmdResetPrev();
        break;

    case 'reset-hard':
        executedCmd = cmdHardReset();
        break;

    case 'seed':
        executedCmd = cmdSeeders();
        break;

    default:
        console.log(`invalid cmd: ${cmd}`);
        process.exit(1);
}

executedCmd
    .then(result => {
        const doneStr = `${cmd.toUpperCase()} DONE`;
        console.log(doneStr);
        console.log('==============================================================================');
    })
    .catch(err => {
        const errorStr = `${cmd.toUpperCase()} ERROR`;
        console.log(errorStr);
        console.log('==============================================================================');
        console.log(err);
        console.log('==============================================================================');
    })
    .then(() => {
        if (cmd !== 'status' && cmd !== 'reset-hard' && cmd !== 'seed') {
            return cmdStatus();
        }
        return Promise.resolve();
    })
    .then(() => process.exit(0));


    