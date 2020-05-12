const { v4 } = require("uuid");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Adress = sequelize.define('Adress', {
    street: DataTypes.STRING,
    postal_code: DataTypes.INTEGER,
    country: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    underscored: true
  },{
    hooks : {
      beforeCreate : (address, options) => {
        address.id = v4();
      }
    }
  });
  Adress.associate = function(models) {
    models.Adress.belongsTo(models.Customer);
  };
  return Adress;
};