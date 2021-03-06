const express = require('express')
const router = express.Router()

const diagnostic_controller = require('../controllers/diagnostic.controller')
router.get('/test', diagnostic_controller.test)
router.get('/list', diagnostic_controller.list)
router.post('/setName', diagnostic_controller.setDiagnosticName)
router.post('/setVariable', diagnostic_controller.setDiagnosticVariable)
router.post('/deleteVariable', diagnostic_controller.deleteDiagnosticVariable)
router.post('/setDiagram', diagnostic_controller.setDiagram)
router.post('/setStatus',diagnostic_controller.setStatus)
router.post('/getStringNodeRules',diagnostic_controller.getStringNodeRules)
router.post('/getVariableList', diagnostic_controller.getVariableList)
router.post('/getDiagramModel', diagnostic_controller.getDiagramModel)
router.post('/setRule',diagnostic_controller.setRule)
router.post('/deleteRule',diagnostic_controller.deleteRuleForNode)
router.post('/compute2', diagnostic_controller.compute2)
router.post('/setDescription', diagnostic_controller.setDiagnosticDescription)
router.post('/getName', diagnostic_controller.getDiagnosticName)
router.post('/getDescription', diagnostic_controller.getDiagnosticDescription)
module.exports = router