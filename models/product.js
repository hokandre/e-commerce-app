const { v4 } = require("uuid");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {
    underscored: true
  }, {
    hooks : {
      beforeCreate : (product, options) => {
        product.id = v4();
      }
    }
  });
  
  Product.associate = function(models) {
    models.Product.belongsTo(models.Category_Product);

    models.Product.hasMany(models.Review);
    models.Product.hasMany(models.Item_Cart);

  };
  return Product;
};