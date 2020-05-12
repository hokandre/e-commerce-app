const bcrypt = require("bcrypt");

module.exports = {
    hash : (password, cb) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if(err) cb(err, null);
            else cb(null, hash);
        });
    },
    compare : (password, hashingPassword, cb) =>{
        bcrypt.compare(password, hashingPassword, function(err, result){
            if(err) cb(err, null);
            else cb(null, result);
        })
    }
}