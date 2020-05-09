'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item_Cart = sequelize.define('Item_Cart', {
    amount: DataTypes.INTEGER,
    note: DataTypes.STRING
  }, {});
  Item_Cart.associate = function(models) {
    // associations can be defined here
  };
  return Item_Cart;
};