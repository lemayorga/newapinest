
const { Envs }  = require('../config')

const DATABASE_URL=`postgres://${Envs.DB_USER}:${Envs.DB_PASSWORD}@${Envs.DB_HOST}:${Envs.DB_PORT}/${Envs.DB_NAME}`;

console.log( DATABASE_URL )
module.exports = {
  development: {
    dialect: 'postgres',
    url: DATABASE_URL,
  },
  test: {
    dialect: 'postgres',
    url:DATABASE_URL,
  },
  production: {
    dialect: 'postgres',
    url: DATABASE_URL,
  },
};



/*
https://www.npmjs.com/package/sequelize-cli/v/6.3.0
https://medium.com/@kupendra.dev/nestjs-sequelize-and-postgres-mastering-migrations-898e0723c938

https://victoronwuzor.medium.com/how-to-setup-sequelize-migration-in-a-nestjs-project-b4aec1f88612
*/