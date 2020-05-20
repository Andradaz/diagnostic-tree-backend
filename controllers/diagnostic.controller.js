const Diagnostic = require('../models/diagnostic.model')

exports.test = function (req, res) {
    res.send('Diagnostic Schema: Greetings from the Test Controller!')
}


exports.setDiagnosticName = function (req, res) {
    //primeste ceva de forma:
    // name: " ",
    // idgen: " "
    let query = { 'idgen': req.body.idgen }
    let newName = req.body.name

    Diagnostic.findOneAndUpdate(query, { name: newName }, { upsert: true }, function (err) {
        if (err) return res.send(500, { error: err })
        return res.send('Succesfully saved new name.')
    });
}

exports.setDiagnosticVariable = function (req, res) {
    //primeste ceva de forma
    // variable: " ",
    //idgen: " "
    let query = { 'idgen': req.body.idgen }
    let newVariable = req.body.variable
    let listVariables
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.variables)
            }
        })
    })

    findEntry.then((list) => {
        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "variables": [newVariable]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully saved new variable in rules.')
            });
        }
        listVariables = list
        listVariables.push(newVariable)
        Diagnostic.findOneAndUpdate(query, { variables: listVariables }, { upsert: true }, function (err) {
            if (err) return res.send(500, { error: err })
            return res.send('Succesfully saved new variable.')
        })
    })
}

exports.deleteDiagnosticVariable = function (req, res) {
    //primeste ceva de forma
    // index: "",
    //idgen: " "
    let query = { 'idgen': req.body.idgen }
    let index = req.body.index
    let listVariables
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            resolve(diagnostic.variables)
        })
    })

    findEntry.then((list) => {
        listVariables = list
        listVariables.splice(index, 1)
        Diagnostic.findOneAndUpdate(query, { variables: listVariables }, { upsert: true }, function (err) {
            if (err) return res.send(500, { error: err })
            return res.send('Succesfully deleted variable at index ' + index)
        })
    })
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

exports.setRuleVariable = function (req, res) {
    //primeste ceva de forma
    // variable: " ",
    //idgen: " ",
    //idnod:
    let query = { 'idgen': req.body.idgen }
    let newVariable = req.body.variable
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    let listRules
    findEntry.then((list) => {
        listRules = list

        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "rules": [{
                    "variable": req.body.variable,
                    "idnode": req.body.idnode
                }]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully saved new variable in rules.')
            });
        } else {
            if (isEmptyObject(list)) {
                listRules = []
                listRules.push({
                    "idnode": req.body.idnode,
                    "variable": req.body.variable
                })
            }
            else {
                let i = 0
                let index = 0
                let exist = false
                while (i < listRules.length) {
                    if (req.body.idnode === listRules[i].idnode) {
                        exist = true
                        index = i
                    }
                    i++
                }
                if (exist) {
                    listRules[index].variable = newVariable
                } else {
                    listRules.push({
                        "idnode": req.body.idnode,
                        "variable": req.body.variable
                    })
                }

            }
            Diagnostic.findOneAndUpdate(query, { rules: listRules }, { upsert: true }, function (err) {
                if (err) return res.send(500, { error: err })
                return res.send('Succesfully saved new variable in rules.')
            })
        }

    })
}


exports.setRuleOperator = function (req, res) {
    //primeste ceva de forma
    // operator: " ",
    //idgen: " ",
    //idnod:
    let query = { 'idgen': req.body.idgen }
    let newOperator = req.body.operator
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    let listRules
    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen o creăm acum
        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "rules": [{
                    "operator": req.body.operator,
                    "idnode": req.body.idnode
                }]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully saved new operator in rules.')
            });
        } else {
            //Dacă Rules nu are niciun element
            if (isEmptyObject(list)) {
                listRules = []
                listRules.push({
                    "idnode": req.body.idnode,
                    "operator": req.body.operator,
                })
            }
            else {
                //Dacă rules are mai multe elemente
                let i = 0
                let index = 0
                let exist = false
                //verificam daca exista in bd nodul din request
                while (i < listRules.length) {
                    if (req.body.idnode === listRules[i].idnode) {
                        exist = true
                        index = i
                    }
                    i++
                }
                //Daca exista un nod cu acelasi id il editam
                if (exist) {
                    listRules[index].operator = newOperator
                } else {
                    //Daca nu exista un nod cu acelasi id, il adaugam la finalul listei
                    listRules.push({
                        "idnode": req.body.idnode,
                        "operator": req.body.operator
                    })
                }

            }
            Diagnostic.findOneAndUpdate(query, { rules: listRules }, { upsert: true }, function (err) {
                if (err) return res.send(500, { error: err })
                return res.send('Succesfully saved new operator in rules.')
            })
        }

    })
}

exports.setRuleParameter = function (req, res) {
    //primeste ceva de forma
    // parameter: " ",
    //idgen: " ",
    //idnod:
    let query = { 'idgen': req.body.idgen }
    let newParameter = req.body.parameter
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    let listRules
    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen o creăm acum
        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "rules": [{
                    "parameter": req.body.parameter,
                    "idnode": req.body.idnode
                }]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully saved new operator in rules.')
            });
        } else {
            //Dacă Rules nu are niciun element
            if (isEmptyObject(list)) {
                listRules = []
                listRules.push({
                    "idnode": req.body.idnode,
                    "parameter": req.body.parameter,
                })
            }
            else {
                //Dacă rules are mai multe elemente
                let i = 0
                let index = 0
                let exist = false
                //verificam daca exista in bd nodul din request
                while (i < listRules.length) {
                    if (req.body.idnode === listRules[i].idnode) {
                        exist = true
                        index = i
                    }
                    i++
                }
                //Daca exista un nod cu acelasi id il editam
                if (exist) {
                    listRules[index].parameter = newParameter
                } else {
                    //Daca nu exista un nod cu acelasi id, il adaugam la finalul listei
                    listRules.push({
                        "idnode": req.body.idnode,
                        "parameter": req.body.parameter
                    })
                }

            }
            Diagnostic.findOneAndUpdate(query, { rules: listRules }, { upsert: true }, function (err) {
                if (err) return res.send(500, { error: err })
                return res.send('Succesfully saved new parameter in rules.')
            })
        }

    })
}

exports.getRuleVariableForNode = function (req, res) {
    //primeste
    //"idgen":
    //"idnode":
    let query = { 'idgen': req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen
        //Sau dacă Rules nu are niciun element
        if (list === null || isEmptyObject(list)) {
            res.send(null)
        } else {
            //Dacă rules are elemente
            let data
            for(let i=0;i<listRules.length;i++){
                if(listRules[i].idnode === req.body.idnode){
                    data = listRules[i].variable
                }
            }
            if(data !== undefined){
                res.send(data)
            }else{
                res.send("not defined")
            }
            
        }
    })
}

exports.getRuleParameterForNode = function (req, res) {
    //primeste
    //"idgen":
    //"idnode":
    //si returneaza regulile pt idnode-ul respectiv
    let query = { 'idgen': req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen
        //Sau dacă Rules nu are niciun element
        if (list === null || isEmptyObject(list)) {
            res.send("este null ")
        } else {
            //Dacă rules are elemente
            let data
            for(let i=0;i<listRules.length;i++){
                if(listRules[i].idnode === req.body.idnode){
                    data = listRules[i].parameter
                }
            }
            if(data !== undefined){
                res.send(data)
            }else{
                res.send(data)
            }
            
        }
    })
}

exports.getRuleOperatorForNode = function (req, res) {
    //primeste
    //"idgen":
    //"idnode":
    //si returneaza regulile pt idnode-ul respectiv
    let query = { 'idgen': req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen
        //Sau dacă Rules nu are niciun element
        if (list === null || isEmptyObject(list)) {
            res.send(null)
        } else {
            //Dacă rules are elemente
            let data
            for(let i=0;i<listRules.length;i++){
                if(listRules[i].idnode === req.body.idnode){
                    data = listRules[i].operator
                }
            }
            if(data !== undefined){
                res.send(data)
            }else{
                data = "akljm"
                res.send(data)
            }
            
        }
    })
}

exports.setDiagram = function (req, res) {
    //primeste
    //"idgen":
    //"diagram":
    let query = { 'idgen': req.body.idgen }
    let newDiagram = req.body.diagram
    newDiagram = JSON.parse(newDiagram)
    Diagnostic.findOneAndUpdate(query, { diagram: newDiagram, published: false }, { upsert: true }, function (err) {
        if (err) {
            console.log(err)
            return res.send(500, { error: err})
        }
        return res.send('Succesfully saved diagram in diagnostic.')
    });
}

exports.list = function (req, res){
    Diagnostic.find(function(err, diagrams){
        if (err) {
            console.log("Error while extracting list. " + err)
            res.send("Error while extracting list. " + err)
        }
        res.send(diagrams)
    })
}

exports.setStatus = function (req,res){
    //primeste id si status(true/false)
    let query = { 'idgen': req.body.id }
    let status = req.body.status

    Diagnostic.findOneAndUpdate(query, { published: status }, { upsert: true }, function (err) {
        if (err) return res.send(500, { error: err })
        return res.send('Succesfully set diagram published status.')
    });
}

exports.setRuleError = function (req, res) {
    //primeste ceva de forma
    // error: true/false,
    //idgen: " ",
    //idnod:
    let query = { 'idgen': req.body.idgen }
    let newError = req.body.error
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    let listRules
    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen o creăm acum
        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "rules": [{
                    "error": req.body.error,
                    "idnode": req.body.idnode
                }]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully saved new operator in rules.')
            });
        } else {
            //Dacă Rules nu are niciun element
            if (isEmptyObject(list)) {
                listRules = []
                listRules.push({
                    "idnode": req.body.idnode,
                    "error": req.body.error,
                })
            }
            else {
                //Dacă rules are mai multe elemente
                let i = 0
                let index = 0
                let exist = false
                //verificam daca exista in bd nodul din request
                while (i < listRules.length) {
                    if (req.body.idnode === listRules[i].idnode) {
                        exist = true
                        index = i
                    }
                    i++
                }
                //Daca exista un nod cu acelasi id il editam
                if (exist) {
                    listRules[index].error = newError
                } else {
                    //Daca nu exista un nod cu acelasi id, il adaugam la finalul listei
                    listRules.push({
                        "idnode": req.body.idnode,
                        "error": req.body.error
                    })
                }

            }
            Diagnostic.findOneAndUpdate(query, { rules: listRules }, { upsert: true }, function (err) {
                if (err) return res.send(500, { error: err })
                return res.send('Succesfully saved new parameter in rules.')
            })
        }

    })
}

exports.getRuleErrorForNode = function (req, res) {
    //primeste
    //"idgen":
    //"idnode":
    let query = { 'idgen': req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen
        //Sau dacă Rules nu are niciun element
        if (list === null || isEmptyObject(list)) {
            res.send(null)
        } else {
            //Dacă rules are elemente
            let data
            for(let i=0;i<listRules.length;i++){
                if(listRules[i].idnode === req.body.idnode){
                    data = listRules[i].error
                }
            }
            if(data !== undefined){
                res.send(data)
            }else{
                res.send("not defined")
            }
            
        }
    })
}

exports.setRuleSolution = function (req, res) {
    //primeste ceva de forma
    // solution: true/false,
    //idgen: " ",
    //idnod:
    let query = { 'idgen': req.body.idgen }
    let newSolution = req.body.solution
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    let listRules
    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen o creăm acum
        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "rules": [{
                    "error": req.body.solution,
                    "idnode": req.body.idnode
                }]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully saved new operator in rules.')
            });
        } else {
            //Dacă Rules nu are niciun element
            if (isEmptyObject(list)) {
                listRules = []
                listRules.push({
                    "idnode": req.body.idnode,
                    "error": req.body.solution,
                })
            }
            else {
                //Dacă rules are mai multe elemente
                let i = 0
                let index = 0
                let exist = false
                //verificam daca exista in bd nodul din request
                while (i < listRules.length) {
                    if (req.body.idnode === listRules[i].idnode) {
                        exist = true
                        index = i
                    }
                    i++
                }
                //Daca exista un nod cu acelasi id il editam
                if (exist) {
                    listRules[index].solution = newSolution
                } else {
                    //Daca nu exista un nod cu acelasi id, il adaugam la finalul listei
                    listRules.push({
                        "idnode": req.body.idnode,
                        "error": req.body.solution
                    })
                }

            }
            Diagnostic.findOneAndUpdate(query, { rules: listRules }, { upsert: true }, function (err) {
                if (err) return res.send(500, { error: err })
                return res.send('Succesfully saved new parameter in rules.')
            })
        }

    })
}

exports.getRuleSolutionForNode = function (req, res) {
    //primeste
    //"idgen":
    //"idnode":
    let query = { 'idgen': req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen
        //Sau dacă Rules nu are niciun element
        if (list === null || isEmptyObject(list)) {
            res.send(null)
        } else {
            //Dacă rules are elemente
            let data
            for(let i=0;i<listRules.length;i++){
                if(listRules[i].idnode === req.body.idnode){
                    data = listRules[i].solution
                }
            }
            if(data !== undefined){
                res.send(data)
            }else{
                res.send("not defined")
            }
            
        }
    })
}





//Returnam modelul GoJS al diagramei
exports.getDiagramModel = function(req,res){
    let query = { 'idgen': req.body.idgen }
    let inputs = req.body.inputs
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.diagram)
            }
        })
    })
    findEntry.then((diagram) => {
        if (diagram === null || isEmptyObject(diagram)) {
            res.send(null)
        }else{
            res.send(diagram)
        }
    })
}


exports.getVariableList = function (req,res) {
    let query = { 'idgen': req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic.variables)
            }
        })
    })

    findEntry.then((variables)=>{
        if (variables === null) {
            res.send([])
        }else{
            res.send(variables)
        }
    })
}

///Compute diagram////////////////////////////////////////////////////////////////////////////////////
//primeste idgen și valoarea parametriilor
//ex:
//data = {
//     "idgen": "SKSFNSDJKNJ",
//     "inputs": []
// }
//returneaza un array cu calea care trebuie colorata
exports.compute = function(req,res){
    let query = { 'idgen': req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve(null)
            } else {
                resolve(diagnostic)
            }
        })
    })

    findEntry.then((diagram) => {
        let rules = diagram.rules
        let nodeDataArray = diagram.diagram[0].nodeDataArray
        let linkDataArray = diagram.diagram[0].linkDataArray
        console.log("Rules")
        console.log(rules)
        console.log("NodeDataArray")
        console.log(nodeDataArray)
        console.log("LinkDataArray")
        console.log(linkDataArray)
        res.send(200)
    })
}