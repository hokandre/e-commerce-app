'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('item_carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
          references: {
              model: 'customers',
              key: 'id'
        }
      },
      transaction_id: {
        type: Sequelize.INTEGER,
          references: {
              model: 'transactions',
              key: 'id'
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
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