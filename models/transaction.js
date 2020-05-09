'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    payment_date: DataTypes.DATE,
    amount: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};