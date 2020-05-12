const { v4 } = require("uuid");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', 
  {
    star: DataTypes.INTEGER,
    Review: DataTypes.STRING
  }, {
    underscored: true
  },{
    hooks : {
      beforeCreate : (review, options) => {
        review.id = v4();
      }
    }
  });

  Review.associate = function(models) {
    models.Review.belongsTo(models.Customer);
    models.Review.belongsTo(models.Product);
  };
  return Review;
};