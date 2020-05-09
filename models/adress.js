'use strict';
module.exports = (sequelize, DataTypes) => {
  const Adress = sequelize.define('Adress', {
    street: DataTypes.STRING,
    postal_code: DataTypes.INTEGER,
    country: DataTypes.STRING,
    city: DataTypes.STRING
  }, {});
  Adress.associate = function(models) {
    // associations can be defined here
  };
  return Adress;
};