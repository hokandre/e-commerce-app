require('dotenv').config();

module.exports = {
  development: {
    database: process.env.db_e_commerce_dev,
    username: process.env.db_username,
    password: process.env.db_password,
    host: process.env.db_host,
    dialect: 'postgres',
    define: {
      underscored: true
    }
  },
  test: {
    database: process.env.db_e_commerce_test,
    username: process.env.db_username,
    password: process.env.db_password,
    host: process.env.db_host,
    dialect: 'postgres',
    define: {
      underscored: true
    }
  },
  production: {
    database: process.env.db_e_commerce_prod,
    username: process.env.db_username,
    password: process.env.db_password,
    host: process.env.db_host,
    dialect: 'postgres',
    define: {
      underscored: true
    }
  }
}