const { v4 } = require("uuid");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    payment_date: DataTypes.DATE,
    amount: DataTypes.INTEGER
  }, {
    underscored: true
  }, {
    hooks : {
      beforeCreate : (transaction , options) => {
        transaction.id = v4();
      }
    }
  });
  Transaction.associate = function(models) {
    models.Transaction.belongsTo(models.Customer);

    models.Transaction.hasMany(models.Item_Cart);
  };
  return Transaction;
};