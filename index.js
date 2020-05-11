require('dotenv').config();
const env = process.env.NODE_ENV;

const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const createError = require("http-errors");

const { Sequelize } = require("sequelize");
const config = require('./config/config.js')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

try{
    sequelize.authenticate();
    console.log("SEQUELIZE IS CONNECTED!");
}catch(error){
    console.log(`error : connect to sequelize`);
}

const customerRouter = require('./routes/customer_router.js');

const PORT = process.env.PORT;
const app = express();

app.use(cors())
    .use(express.urlencoded({
        limit : '50mb',
        extended : true
    }))
    .use(express.json({
        limit : '50mb'
    }))
    .use(helmet());

app.use('/customer', customerRouter);

/**
 * HANDLER 404 
 */
app.use((req, res, next) => {
    return next( createError(404,'Page not found'));
})

/**
 * ERROR HANDLING
 */
app.use( (err, req, res, next) => {

   console.log("\x1b[33m", err);

   res.status(err.status || 500).json({
       status : err.status,
       message : err.message,
       properties : err.errors || null
   })
})

app.listen(PORT, ()=>{
    console.log("Listen to PORT : ", PORT);
})

module.exports = app;