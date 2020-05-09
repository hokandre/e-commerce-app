'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    payment_date: DataTypes.DATE,
    amount: DataTypes.INTEGER
  }, {
    underscored: true
  });
  Transaction.associate = function(models) {
    models.Transaction.belongsTo(models.Customer);

    models.Transaction.hasMany(models.Item_Cart);
  };
  return Transaction;
};