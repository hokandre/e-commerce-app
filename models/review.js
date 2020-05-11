'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', 
  {
    star: DataTypes.INTEGER,
    Review: DataTypes.STRING
  }, {
    underscored: true
  });

  Review.associate = function(models) {
    models.Review.belongsTo(models.Customer);
    models.Review.belongsTo(models.Product);
  };
  return Review;
};