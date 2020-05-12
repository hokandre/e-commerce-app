const { Customer } = require('../models/index');
const { formatErrorSequelize } = require("../helper/error_handler");
const { upload_avatar_image } = require("../helper/upload_images");

const sequelize = require("../database/sequelize");
const multer = require("multer");
const createError = require("http-errors");
const moment = require("moment");
const FORMAT_DATE = process.env.DATE_FORMAT;



module.exports = {
    register : (req, res, next) => {
        upload_avatar_image(req, res, async (err) => {    
            if (err instanceof multer.MulterError) {
                let properties = formatErrorSequelize({ type : 'Multer' , ...err});              
                return next(createError(400, 'bad request', properties));
            } else if (err) {
                return next(createError(500, 'internal server error', properties));
            }
            
            sequelize.transaction(async (t) => {

                let dataNewCustomer = {
                    name : req.body.name,
                    birthday : req.body.birthday,
                    email : req.body.email,
                    gender : req.body.gender,
                    avatar : req.file ? req.file.path : "",
                    password : req.body.password,
                    username : req.body.username
                }

                try {
                    let newCustomer = await Customer.create(dataNewCustomer,{ transaction : t});
                    res.status(201).json({
                        id : newCustomer.id,
                        name : newCustomer.name,
                        birthday : moment(newCustomer.birthday).format(FORMAT_DATE),
                        email : newCustomer.email,
                        gender : newCustomer.gender,
                        avatar : newCustomer.avatar,
                        username : newCustomer.username 
                    });
                } catch(error){
                    console.log("\x1b[33m", "CONSOLE LOG CONTROLLER REGISTRASI");
                    console.log(error);
                    
                    let properties = formatErrorSequelize({type:"sequelize", ...error});
                    properties.stack = error;
                    return next(createError(400, 'bad request', properties));
                }
            })
        }) 
    }
}