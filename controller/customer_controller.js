const { Customer } = require('../models/index');
const { formatErrorSequelize } = require("../helper/error_handler");
const { upload_avatar_image } = require("../helper/upload_images");

const multer = require("multer");
const moment = require('moment');
const createError = require("http-errors");
const FORMAT_DATE = process.env.DATE_FORMAT;

module.exports = {
    register : (req, res, next) => {
        upload_avatar_image(req, res, function(err){    
            if (err instanceof multer.MulterError) {
                let properties = formatErrorSequelize({ type : 'Multer' , ...err});              
                return next(createError(400, 'bad request', properties));
            } else if (err) {
                return next(createError(500, 'internal server error', properties));
            }
    
            let dataNewCustomer = {
                name : req.body.name,
                birthday : moment(req.body.birthday).format(FORMAT_DATE),
                email : req.body.email,
                gender : req.body.gender,
                avatar : req.file.path,
                password : req.body.password,
                username : req.body.username 
            }
    
            Customer.create(dataNewCustomer)
                .then(newCustomer => {
                    res.status(201).json({
                        id : newCustomer.id,
                        name : newCustomer.name,
                        birthday : moment(newCustomer.birthday).format(FORMAT_DATE),
                        email : newCustomer.email,
                        gender : newCustomer.gender,
                        avatar : newCustomer.avatar,
                        username : newCustomer.username 
                    });
                })
                .catch(err => {
                    let properties = formatErrorSequelize({type:"sequqlize", ...err});
                    properties.stack = err;
                    return next(createError(400, 'bad request', properties));
                })
        }) 
    }
}