const uuid = require('uuid');

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      customer_id: {
        type: Sequelize.UUID,
          references: {
              model: 'customers',
              key: 'id'
        }
      },
      product_id: {
        type: Sequelize.UUID,
          references: {
              model: 'products',
              key: 'id'
        }
      },
      star: {
        type: Sequelize.INTEGER
      },
      review: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('reviews');
  }
};