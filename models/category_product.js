const { v4 } = require("uuid");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category_Product = sequelize.define('Category_Product', {
    name: DataTypes.STRING
  }, {
    underscored: true
  },{
    hooks : {
      beforeCreate : (category, options) => {
        category.id = v4();
      }
    }
  });
  Category_Product.associate = function(models) {
    models.Category_Product.hasMany(models.Product);
  };
  return Category_Product;
};