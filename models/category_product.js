'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category_Product = sequelize.define('Category_Product', {
    name: DataTypes.STRING
  }, {});
  Category_Product.associate = function(models) {
    // associations can be defined here
  };
  return Category_Product;
};