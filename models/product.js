'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};