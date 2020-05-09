'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Item_Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
          references: {
              model: 'Customers',
              key: 'id'
        }
      },
      transaction_id: {
        type: Sequelize.INTEGER,
          references: {
              model: 'Transactions',
              key: 'id'
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
          references: {
              model: 'Products',
              key: 'id'
        }
      },
      amount: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Item_Carts');
  }
};