#!/bin/sh

npx sequelize-cli db:create

npx sequelize-cli model:generate --name Customer --attributes name:STRING,birhtday:DATE, email:STRING, gender: enum:'{M,F}', avatar:STRING, password:STRING, username:STRING

npx sequelize-cli model:generate --name Adress --attributes street:STRING, postal_code:INTEGER, country:STRING, city:STRING

npx sequelize-cli model:generate --name Product --attributes name:STRING, stock:INTEGER

npx sequelize-cli model:generate --name Category_Product --attributes name:STRING

npx sequelize-cli model:generate --name Item_Cart --attributes amount:INTEGER, note:STRING 

npx sequelize-cli model:generate --name Transaction --attributes payment_date:DATE, amount:integer

npx sequelize-cli model:generate --name review --attributes star:INTEGER, review:STRING