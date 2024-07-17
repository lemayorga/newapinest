'use strict';
import sequelize from "sequelize/types/sequelize";
import { QueryInterface } from 'sequelize';

const schemaNameCommun = 'commun';
const schemaNameSecurity = 'security';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface:QueryInterface,Sequelize: sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  
    await queryInterface.createSchema(schemaNameCommun, {  });
    await queryInterface.createSchema(schemaNameSecurity, {  });
  },

  async down (queryInterface:QueryInterface,Sequelize:sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropSchema(schemaNameCommun, {  });
    await queryInterface.dropSchema(schemaNameSecurity, {  });
  }
};
