const multer = require("multer");
const path = require("path");
const multerErrorCode = {
    LIMIT_PART_COUNT: 'Too many parts',
    LIMIT_FILE_SIZE: 'File too large',
    LIMIT_FILE_COUNT: 'Too many files',
    LIMIT_FIELD_KEY: 'Field name too long',
    LIMIT_FIELD_VALUE: 'Field value too long',
    LIMIT_FIELD_COUNT: 'Too many fields',
    LIMIT_UNEXPECTED_FILE: 'Unexpected field'
};

const upload_avatar_image = multer({
    storage : multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname,"../assets/avatar"));
          },
        filename: function (req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        }
    }),
    fileFilter : function(req, file, callback){
        let fileExtension = path.extname(file.originalname);
        if(fileExtension !== '.png' && fileExtension !== '.jpg' && fileExtension !== '.gif' && fileExtension !== '.jpeg'){
            return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
        }

        callback(null, true);
    },
    limits : {
        // 1 mb
        fileSize : 1 * 1024 * 1024
    },

}).single("avatar");


module.exports = {
    upload_avatar_image,
    multerErrorCode
};