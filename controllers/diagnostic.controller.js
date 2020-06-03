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

exports.getDiagnosticName = function (req, res) {
    let query = { 'idgen': req.body.idgen }
    let name = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve("Not found")
            } else {
                resolve(diagnostic.name)
            }
        })
    })
    name.then((name) => {
        let data = {
            name: name
        }
        res.send(data)
    })

}

exports.getDiagnosticDescription = function (req, res) {
    let query = { 'idgen': req.body.idgen }
    let name = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve("Not found")
            } else {
                resolve(diagnostic.description)
            }
        })
    })
    name.then((description) => {
        let data = {
            description: description
        }
        res.send(data)
    })

}


exports.setDiagnosticDescription = function (req, res) {
    //primeste ceva de forma:
    // description: " ",
    // idgen: " "
    let query = { 'idgen': req.body.idgen }
    let newDescription = req.body.description

    Diagnostic.findOneAndUpdate(query, { description: newDescription }, { upsert: true }, function (err) {
        if (err) return res.send(500, { error: err })
        return res.send('Succesfully saved new name.')
    });
}

exports.setDiagnosticVariable = function (req, res) {
    //primeste ceva de forma
    // variable = {
    //  name: ,
    //  req: 
    //},
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

//primeste un req de forma
// rule: {
//     variable: ,
//     operator: ,
//     parameter: ,
//     description: 
// }
// idgen: ,
// idnod: 
exports.setRule = function (req, res) {
    let query = { "idgen": req.body.idgen }
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

        //Daca nu exista diagrama creata pentru idgen
        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "rules": [{
                    "idnode": req.body.idnode,
                    "rule": [req.body.rule]
                }]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully saved new variable in rules.')
            });
        } else {
            //Dacă Rules nu are niciun element
            if (isEmptyObject(listRules)) {
                listRules = []
                listRules.push({
                    "idnode": req.body.idnode,
                    "rule": [req.body.rule]
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
                //Daca exista un nod cu acelasi id, adaugam lui Rule noua regula
                if (exist) {
                    listRules[index].rule.push(req.body.rule)
                } else {
                    //Daca nu exista un nod cu acelasi id, il adaugam la finalul listei
                    listRules.push({
                        "idnode": req.body.idnode,
                        "rule": [req.body.rule]
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

//primeste
//"idgen"
//"idnode"
//returneaza un array de string-uri cu descrierea regulilor
exports.getStringNodeRules = function (req, res) {
    let query = { "idgen": req.body.idgen }
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve([])
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
            res.send([])
        } else {
            //Dacă rules are elemente
            let rule
            for (let i = 0; i < listRules.length; i++) {
                if (listRules[i].idnode === req.body.idnode) {
                    rule = listRules[i].rule
                }
            }

            let description = []
            if (rule !== null && !isEmptyObject(rule)) {
                for (i = 0; i < rule.length; i++) {
                    description.push(rule[i].description)
                }
                if (description !== undefined) {
                    res.send(description)
                } else {
                    res.send([])
                }
            } else {
                res.send([])
            }
        }
    })

}

//primeste
//idgen
//idnode
//indicele regulii
//sterge regula respectiva
exports.deleteRuleForNode = function (req, res) {
    let query = { "idgen": req.body.idgen }
    let index = req.body.index
    let findEntry = new Promise((resolve, reject) => {
        Diagnostic.findOne(query, function (err, diagnostic) {
            if (err) return res.send(500, { error: err })
            if (diagnostic === null) {
                resolve([])
            } else {
                resolve(diagnostic.rules)
            }
        })
    })

    findEntry.then((list) => {
        listRules = list
        for (i = 0; i < listRules.length; i++) {
            if (listRules[i].idnode === req.body.idnode) {
                listRules[i].rule.splice(index, 1)
            }
        }
        Diagnostic.findOneAndUpdate(query, { rules: listRules }, { upsert: true }, function (err) {
            if (err) return res.send(500, { error: err })
            return res.send('Succesfully deleted rule at index ' + index)
        })
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
            return res.send(500, { error: err })
        }
        return res.send('Succesfully saved diagram in diagnostic.')
    });
}

exports.list = function (req, res) {
    Diagnostic.find(function (err, diagrams) {
        if (err) {
            console.log("Error while extracting list. " + err)
            res.send("Error while extracting list. " + err)
        }
        res.send(diagrams)
    })
}

exports.setStatus = function (req, res) {
    //primeste id si status(true/false)
    let query = { 'idgen': req.body.id }
    let status = req.body.status

    Diagnostic.findOneAndUpdate(query, { published: status }, { upsert: true }, function (err) {
        if (err) return res.send(500, { error: err })
        return res.send('Succesfully set diagram published status.')
    });
}

//primeste ceva de forma
//type: "mid,solution,error",
//idgen: " ",
//idnod:
exports.setNodeType = function (req, res) {
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

    let listRules
    findEntry.then((list) => {
        listRules = list
        //Dacă nu există diagramă creată pentru idgen o creăm acum
        if (list === null) {
            Diagnostic.create({
                "idgen": req.body.idgen,
                "rules": [{
                    "idnode": req.body.idnode,
                    "nodeType": req.body.type
                }]
            }, function (err) {
                if (err) return res.send(500, { error: err })
                res.send('Succesfully set node type.')
            });
        } else {
            //Dacă Rules nu are niciun element
            if (isEmptyObject(listRules)) {
                listRules = []
                listRules.push({
                    "idnode": req.body.idnode,
                    "nodeType": req.body.type
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
                //Daca exista un nod cu acelasi id, adaugam tipul
                if (exist) {
                    listRules[index].nodeType = req.body.type
                } else {
                    //Daca nu exista un nod cu acelasi id, il adaugam la finalul listei
                    listRules.push({
                        "idnode": req.body.idnode,
                        "nodeType": req.body.type
                    })
                }
            }
            Diagnostic.findOneAndUpdate(query, { rules: listRules }, { upsert: true }, function (err) {
                if (err) return res.send(500, { error: err })
                return res.send('Succesfully set node type.')
            })
        }
    })
}

//Returnam modelul GoJS al diagramei
exports.getDiagramModel = function (req, res) {
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
        } else {
            res.send(diagram)
        }
    })
}


exports.getVariableList = function (req, res) {
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

    findEntry.then((variables) => {
        if (variables === null) {
            res.send([])
        } else {
            res.send(variables)
        }
    })
}

//###################################################################################################
//##################COMPUTE DIAGRAM #################################################################
//
//primeste idgen și valoarea parametriilor
//ex:
//data = {
//     "idgen": "SKSFNSDJKNJ",
//     "inputs": []
// }
//returneaza un o matrice cu culorile nodurilor modificate in functie de traseul calculat,
//pentru a realiza animatia
//nodeDataArray pas 1 colorat
//nodeDataArray pas 2 colorat
//.....

function getRuleNode2(rules, idnode) {
    for (i = 0; i < rules.length; i++) {
        if (rules[i].idnode == idnode)
            return rules[i]
    }
    return "not found"
}

//returneaza id-ul nodului care are ramura true/false si 
//care il are ca tata pe nodul trimis ca parametru
function findChild2(parent, link, linkDataArray) {
    for (i = 0; i < linkDataArray.length; i++) {
        if (linkDataArray[i].from === parent && linkDataArray[i].text == link) {
            child = linkDataArray[i].to
            return child
        }
    }
    return "not found"
}


//returneaza matricea descrisa mai sus
//primeste nodeDataArray si traseul
//JS face o copie prin referinta, dar noi
//avem nevoie de o clona deci folosim
//stringify si parse pentru deep copy
function animationMatrix2(nodeDataArray, path) {
    let matrix = []
    let listCopy = JSON.parse(JSON.stringify(nodeDataArray))
    matrix.push(JSON.parse(JSON.stringify(listCopy)))

    for (i = 0; i < path.length; i++) {
        let index = listCopy.findIndex((node) => { return node.key === path[i] })
        listCopy[index].color = '#78e1ff'
        matrix.push(JSON.parse(JSON.stringify(listCopy)))
    }

    return matrix
}

function computeRule(currentNodeRule, inputs, variablesProperties) {
    let operator = currentNodeRule.operator
    let param = parseFloat(currentNodeRule.parameter)
    let variable = currentNodeRule.variable
    let required = variablesProperties[variable].req
    let expression

    if ((typeof inputs[variable] === "undefined" || inputs[variable] === "") && required === false) {
        return true
    }

    //calculam regula nodului utilizand input-ul de la user
    let input = parseFloat(inputs[variable])
    switch (operator) {
        case '10':
            expression = (input > param)
            break;
        case '20':
            expression = (input <= param)
            break;
        case '30':
            expression = (input === param)
            break;
    }
    return expression
}


exports.compute2 = function (req, res) {
    let query = { 'idgen': req.body.idgen }
    let inputs = req.body.inputs
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
        let variablesProperties = diagram.variables

        //Nodul de start va fi nodul care nu are parinte. In cazul nostru, primul nod din nodeDataArray va fi
        //radacina.
        let currentNode = nodeDataArray[0].key

        //construim o functie care ne returneaza regulile aferente nodului
        let currentNodeRule = getRuleNode2(rules, currentNode)

        let path = []
        path.push(currentNode)

        //cat timp suntem intr-un nod intermediar
        while (currentNode !== "not found" && currentNodeRule !== "not found") {

            let expression = true
            for (let i = 0; i < currentNodeRule.rule.length; i++) {
                let result = computeRule(currentNodeRule.rule[i], inputs, variablesProperties)
                expression = expression && result
            }

            let child = findChild2(currentNode, expression, linkDataArray)

            if (child !== "not found") {
                path.push(child)
            }

            currentNode = child
            currentNodeRule = getRuleNode2(rules, currentNode)
        }

        //functie care ne construieste matricea descrisa mai sus
        let matrix = animationMatrix2(nodeDataArray, path)
        res.send(matrix)
    })
}