const router = require('express').Router();

const { register, update } = require("../controller/customer_controller");

router.post('/', register);
router.put('/:id', update);

module.exports = router;

