const router = require('express').Router();
const { upload_avatar_image } = require("../helper/upload_images");

const { register } = require("../controller/customer_controller");

router.post('/', register);

module.exports = router;

