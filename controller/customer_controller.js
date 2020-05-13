const { Customer, Sequelize } = require('../models/index');
const { Op } = require("sequelize");
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
                    let properties = formatErrorSequelize({type:"sequelize", ...error});
                    properties.stack = error;
                    return next(createError(400, 'bad request', properties));
                }
            })
        }) 
    },
    update : (req, res, next) => {
        upload_avatar_image(req, res, async (err) => {    
            if (err instanceof multer.MulterError) {
                let properties = formatErrorSequelize({ type : 'Multer' , ...err});              
                return next(createError(400, 'bad request', properties));
            } else if (err) {
                return next(createError(500, 'internal server error', properties));
            }

            let customerId = req.params.id;

            try {

               let customer = await Customer.findOne({ 
                   where : { 
                       [Op.and] : [
                           Sequelize.literal(`id::text = '${customerId}'`)
                        ] 
                    }
                });
                

               if(!customer) return res.status(204).json({ message : 'no content'});
                

               if(req.body.password && req.body.password == "DUNIA INI"){
                    console.log("\x1b[31m", "PASSWORD BEFORE :");
                    console.log("\x1b[44m",  customer.password);
                }

               if(req.body.name) customer.name = req.body.name;
               if(req.body.birthday) customer.birthday = req.body.birthday;
               if(req.body.email) customer.email = req.body.email;
               if(req.body.gender) customer.gender = req.body.gender;
               if(req.file) customer.avatar = req.file.path; 
               if(req.body.password) customer.password = req.body.password;
               if(req.body.username) customer.username = req.body.username;

              
               let updatedCustomer = await customer.save();

               res.status(200).json({
                   id : updatedCustomer.id,
                   name : updatedCustomer.name,
                   birthday : moment(updatedCustomer.birthday).format(FORMAT_DATE),
                   email : updatedCustomer.email,
                   gender : updatedCustomer.gender,
                   username : updatedCustomer.username,
                   avatar : updatedCustomer.avatar
               })

            } catch(error){

                let properties = formatErrorSequelize({type:"sequelize", ...error});
                properties.stack = error;
                return next(createError(400, 'bad request', properties));
            }
        })
    }
}