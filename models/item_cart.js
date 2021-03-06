const { v4 } = require("uuid");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item_Cart = sequelize.define('Item_Cart', {
    amount: DataTypes.INTEGER,
    note: DataTypes.STRING
  }, {
    underscored: true
  }, {
    hooks : {
      beforeCreate : (item , options) => {
        item.id = v4();
      }
    }
  });
  Item_Cart.associate = function(models) {
    models.Item_Cart.belongsTo(models.Customer);
    models.Item_Cart.belongsTo(models.Product);
    models.Item_Cart.belongsTo(models.Transaction);

  };
  return Item_Cart;
};