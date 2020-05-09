'use strict';
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    star: DataTypes.INTEGER,
    review: DataTypes.STRING
  }, {
    underscored: true
  });
  review.associate = function(models) {
    models.Review.belongsTo(model.Customer);
    models.Review.belongsTo(model.Product);
  };
  return review;
};