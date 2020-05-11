module.exports = {
    formatErrorSequelize : (error) => {
        let errorFormat = {
            errors : []
        };

        if(error.type.toLowerCase() == 'sequelize'){
            error.errors.forEach(validationErrorItem =>{
                errorFormat.errors.push({
                    property : validationErrorItem.path,
                    message : validationErrorItem.message
                });
            })
        }

        if(error.type.toLowerCase() == "multer"){
            errorFormat.errors.push({
                property : "avatar",
                message : error.message
            })
        }
        return errorFormat;
    }
}