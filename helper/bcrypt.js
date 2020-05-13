const bcrypt = require("bcrypt-nodejs");

module.exports = {
    hashPassword : async (password) => {
    
        let hashPassword = await  new Promise((resolve, reject) => {
            bcrypt.hash(password,bcrypt.genSaltSync(),null, (err, hash) => {
                if(err) reject(err) ;
                else resolve(hash)
            });
        })

        return hashPassword;
    },
    comparePassword : async (password, hashingPassword) =>{

        let result = await new Promise((resolve, reject) => {
            bcrypt.compare(password, hashingPassword, function(err, boolPasswordValid){
                if(err) reject(err);
                else resolve(boolPasswordValid);
            })
        })
    
        return result;
    }
}




