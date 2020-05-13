const { v4 } = require("uuid");

'use strict';
const moment = require('moment');
const FORMAT_DATE = process.env.DATE_FORMAT;
const { hashPassword } = require("../helper/bcrypt");

module.exports = (sequelize, DataTypes) => {
  
  const Customer = sequelize.define('Customer', {
    name: {
      type : DataTypes.STRING(50),
      allowNull : false,
      validate : {
        notNull : {
          args : true,
          msg : "name cannot be null value"
        },
        notEmpty : {
          args : true,
          msg : "name must be filled"
        }
      }
    },
    birthday:{ 
      type : DataTypes.DATEONLY, 
      allowNull : false,
      validate : {
        isDate : {
          args : true,
          msg : "birthday's format is  incorrect"
        },
        notNull : {
          args : true,
          msg : "birthday cannot be null value"
        },
        notEmpty : {
          args : true,
          msg : "birthday must be filled"
        }
      }
    },
    email: {
      type : DataTypes.STRING(50),
      allowNull : false,
      unique : {
        args : true,
        msg : "email address already in use"
      },
      validate : {
        isUnique : async function(value, next) {
          const user = this;
          const userRegistered = await Customer.findOne({
            where : { email : value}
          })
           
          if(userRegistered && (user.id != userRegistered.id)) return  next("email address already in use");

          next();

        },
        notEmpty : {
          args : true,
          msg : "email must be filled"
        },
        notNull : {
          args : true,
          msg : "email cannot be null value"
        },
        isEmail : {
          args : true,
          msg : "email's format is incorrect"
        }
      }
    },
    gender: { 
      type : DataTypes.ENUM('M', 'F'),
      defaultValue : 'M',
      validate : {
        isIn : {
          args : [['M','F']],
          msg : "gender is incorrect type"
        }
      }
    },
    avatar: {
      type : DataTypes.STRING(255),
      defaultValue : 'default-avatar.jpg',
    },
    password: { 
      type :  DataTypes.STRING(255),
      validate : {
        minCaracter : function(value, next){
          if(value.length == 0) return next('password must be filled');

          if(value.length < 8) return next('password must be min 8 letter');

          next();
        }
      }
    },
    username: { 
      type : DataTypes.STRING,
      unique : {
        args : true,
        msg : "username already in use"
      },
      allowNull : false,
      validate : {
        is : {
          args : /^[a-z0-9]+$/i,
          msg : "username just can use alpanumeric"
        },
        isUnique : async function(value, next) {
          const user = this;
          let userRegistered = await Customer.findOne({
            where : { username : value}
          })
            
          if(userRegistered && (user.id != userRegistered.id)) return  next("username already in use");
          next();
        },
        notNull : {
          args : true,
          msg : "username cannot be null value"
        },
        minCaracter : function(value, next){
          if(value.length == 0) return next("username must be filled");

          if(value.length < 8) return next('username must be min 8 caracter');

          next();
        }
      }
    }
  }, {
    indexes: [
      {
        fields: ['email','username'],
        unique: true
      }
    ],
    hooks : {
      beforeValidate : (customer, options) => {
        let isValid = moment(customer.dataValues.birthday).isValid();
        
        if(isValid) moment(customer.dataValues.birthday).format(FORMAT_DATE);

      },
      beforeCreate : async (customer, options) => {
        if(!customer.id) customer.id = v4();

        const currentPassword = customer.dataValues.password;
        const oldPassword = customer._previousDataValues.password;
     
        if(currentPassword !== oldPassword ) {
          try{
            let hashedPassword = await hashPassword(currentPassword);
            customer.password = hashedPassword;
          }catch(err){
            throw new Error("something broken while hashing password");
          }
        }

      },
      beforeUpdate : async(customer, options) => {
        const currentPassword = customer.dataValues.password;
        const oldPassword = customer._previousDataValues.password;
    
        if(currentPassword !== oldPassword ) {
          try{
            let hashedPassword = await hashPassword(currentPassword);
            customer.password = hashedPassword;
          }catch(err){
            throw new Error("something broken while hashing password");
          }
        }
      }
    },
    underscored: true
  });

 

  Customer.associate = function(models) {
    models.Customer.hasMany(models.Adress);
    models.Customer.hasMany(models.Transaction);
    models.Customer.hasMany(models.Review);
    models.Customer.hasMany(models.Item_Cart);
  };
  return Customer;
};
