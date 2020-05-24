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
//router.post('/setRuleError', diagnostic_controller.setRuleError)
//router.post('/getRuleErrorForNode', diagnostic_controller.getRuleErrorForNode)
//router.post('/setRuleSolution', diagnostic_controller.setRuleSolution)
//router.post('/getRuleSolutionForNode', diagnostic_controller.getRuleSolutionForNode)
router.post('/getStringNodeRules',diagnostic_controller.getStringNodeRules)
router.post('/getVariableList', diagnostic_controller.getVariableList)
router.post('/getDiagramModel', diagnostic_controller.getDiagramModel)
router.post('/compute', diagnostic_controller.compute)
router.post('/setRule',diagnostic_controller.setRule)
router.post('/deleteRule',diagnostic_controller.deleteRuleForNode)
router.post('/setNodeType', diagnostic_controller.setNodeType)
router.post('/getNodeType', diagnostic_controller.getNodeType)
module.exports = router