const express = require('express')
const router = express.Router()

const diagram_controller = require('../controllers/diagram.controller')
router.get('/test', diagram_controller.test)
router.post('/create',diagram_controller.diagram_create)
router.get('/list', diagram_controller.list)
router.get('/:id', diagram_controller.diagram_details)

module.exports = router