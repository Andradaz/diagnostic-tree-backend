var express = require('express');
var router = express.Router();

const user_controller =  require('../controllers/user.controller')
router.post('/signup', user_controller.registerUserData)
router.post('/signin', user_controller.signInUserData)

module.exports = router;