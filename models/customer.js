'use strict';
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
    birhtday:{ 
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
        isEmail : {
          args : true,
          msg : "email's format is incorrect"
        },
        notNull : {
          args : true,
          msg : "email cannot be null value"
        },
        notEmpty : {
          args : true,
          msg : "email must be filled"
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
        is: {
          args : /^[0-9a-f]{64}$/i,
          msg : "password contains invalid caracter"
        },
        min : {
          args : [8],
          msg : "password must be min 8 letter"
        },
        notNull : {
          args : true,
          msg : "password cannot be null value"
        },
        notEmpty : {
          args : true,
          msg : "password must be filled"
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
        notNull : {
          args : true,
          msg : "username cannot be null value"
        },
        notEmpty : {
          args : true,
          msg : "username must be filled"
        },
        min : {
          args : [8],
          msg : "username must be min 8 letter"
        }
      }
    }
  }, {
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