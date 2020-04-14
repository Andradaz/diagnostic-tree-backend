const express = require('express')
const router = express.Router()

const diagram_controller = require('../controllers/diagram.controller')
router.post('/create',diagram_controller.diagramCreate)
router.get('/list', diagram_controller.list)
router.post('/setStatus', diagram_controller.setStatus)

module.exports = router