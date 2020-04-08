const express = require('express')
const router = express.Router();

const representation_controller = require('../controllers/representation.controller')
router.get('/test', representation_controller.test)
router.post('/create', representation_controller.create)
router.post('/getByName', representation_controller.get_by_name)

module.exports = router