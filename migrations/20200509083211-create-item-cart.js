const uuid = require('uuid');

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('item_carts', {
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
      transaction_id: {
        type: Sequelize.UUID,
          references: {
              model: 'transactions',
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
      amount: {
        type: Sequelize.INTEGER
      },
      note: {
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
    return queryInterface.dropTable('item_carts');
  }
};