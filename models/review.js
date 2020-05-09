'use strict';
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    star: DataTypes.INTEGER,
    review: DataTypes.STRING
  }, {});
  review.associate = function(models) {
    // associations can be defined here
  };
  return review;
};