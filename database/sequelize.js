const env = process.env.NODE_ENV;
const { Sequelize } = require("sequelize");
const config = require('../config/config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;