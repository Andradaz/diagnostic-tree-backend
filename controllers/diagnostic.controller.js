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
    console.log("IDGEN IN DIAGRAM MODEL")
    console.log(req.body.idgen)
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
    console.log(variablesProperties)
    let operator = currentNodeRule.operator
    let param = parseFloat(currentNodeRule.parameter)
    let variable = currentNodeRule.variable
    console.log("variable" + variable)
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

//primim outputul din weka il parsam
//intr-un JSON pe care il intelege GoJS
//primeste wekaOutput
//compute weka file
//prima parte a codului este o adaptare a
//algoritmului

function wekaToJson(wekaOutput) {
    let lines = []
    let at_tree = false
    let line_skip = 0

    const splitWekaOutput = wekaOutput.split('\r\n')
    console.log(splitWekaOutput)

    let nrAttributes
    let arrayAttributes = []
    for (i = 0; i < splitWekaOutput.length; i++) {
        let line_raw = splitWekaOutput[i]
        let line
        let newAttribute

        if(nrAttributes > 0){
            newAttribute = line_raw.trim()
            let attObj = {
                "name" : newAttribute,
                "req" : true
            }
            nrAttributes = nrAttributes - 1
            arrayAttributes.push(attObj)

        }
        if(line_raw.includes("Attributes:")){
            nrAttributes = line_raw.substr(14)
            nrAttributes = parseInt(nrAttributes.trimEnd(),10) - 1
        }

        if (line_skip > 0) {
            line_skip = line_skip - 1
        } else {
            line = line_raw.trimEnd()
            if (!at_tree) {
                if (line === "J48 pruned tree") {
                    at_tree = true
                    line_skip = 2
                }
            } else {
                if (line === "") {
                    break;
                }
                lines.push(line)
            }
        }
    }

    console.log("ArrayAttributes ")
    console.log(arrayAttributes)

    let currentKey = 0
    let trace = []
    let nodeDataArray = []
    let linkDataArray = []
    let rules = []

    for (let i = 0; i < lines.length; i++) {
        let level = lines[i].split("|").length - 1
        console.log("\n ### \nIteratia " + i)
        console.log("level " + level)
        console.log("linia: " + lines[i].slice(level * 4))
        let unlevelled_line = lines[i].slice(level * 4)

        //re cand linia contine si solutia ([\w\-]+) ([\<\=\>\!]+) ([0-9a-zA-Z\.\-_]+): ([\S]+) \(([\S]+)\)
        //re cand linia contine doar regula ([\w\-]+) ([\<\=\>\!]+) ([0-9a-zA-Z\.\-_]+)
        //verificam daca este o linie solutie

        let re_sol = /([\w\-]+) ([\<\=\>\!]+) ([0-9a-zA-Z\.\-_]+): ([\S]+) \(([\S]+)\)/
        let re = /([\w\-]+) ([\<\=\>\!]+) ([0-9a-zA-Z\.\-_]+)/

        //obtinem variabila, operatorul si parametrul
        let sol = false
        let variable = ""
        let operator = ""
        let parameter = ""
        let result = ""
        let indexOfOperator
        let indexOfParameter
        let indexOfResult


        if (unlevelled_line.includes("<=")) {
            operator = "<="
            indexOfOperator = unlevelled_line.indexOf("<=")
            indexOfParameter = indexOfOperator + 3
        } else {
            operator = ">"
            indexOfOperator = unlevelled_line.indexOf(">")
            indexOfParameter = indexOfOperator + 2
        }

        variable = unlevelled_line.slice(0, indexOfOperator)
        variable = variable.trimEnd()

        if (re_sol.test(unlevelled_line)) {
            sol = true
            indexOfResult = unlevelled_line.indexOf(":")
            parameter = unlevelled_line.slice(indexOfParameter, indexOfResult)
            result = unlevelled_line.slice(indexOfResult + 2)

        } else {
            sol = false
            parameter = unlevelled_line.slice(indexOfParameter)
        }

        console.log("variable: " + variable)
        console.log("operator: " + operator)
        console.log("parameter: " + parameter)
        console.log("key" + currentKey)
        if (sol) {
            console.log("result: " + result)
        }

        //trace
        let node = {
            "key": currentKey,
            "level": level,
            "operator": operator
        }
        trace.push(node)

        let name = variable + " " + operator+ " " + parameter
        //nodeDataArray
        if (operator === "<=") {
            let nodeDescription = {
                "key": currentKey,
                "color": "#c0cacf",
                "name": name
            }
            nodeDataArray.push(nodeDescription)
        }

        /////daca are si nodul solutie, il adaugam si modificam cheia
        if (sol) {
            let nodeDescription = {
                "key": currentKey + 1,
                "color": "#c0cacf",
                "name": result
            }
            nodeDataArray.push(nodeDescription)
        }

        //rules
        if (operator === "<=") {
            let variableNr = arrayAttributes.map((obj)=> {return obj.name}).indexOf(variable);
            let rule =
            {
                "idnode": currentKey,
                "rule": [{
                    "variable": variableNr,
                    "operator": 20,
                    "parameter": parameter,
                    "description": name
                }]
            }
            rules.push(rule)
        }



        //linkDataArray
        //daca nu e radacina
        if (level - 1 !== -1) {
            let from = 0
            let link
            let text = "false"

            if (operator === ">" && sol) {
                for (let j = trace.length - 2; j >= 0; j--) {
                    if (trace[j].level === level) {
                        from = trace[j].key
                        break;
                    }
                }
                link = {
                    "from": from,
                    "to": currentKey + 1,
                    "text": "false"
                }
                linkDataArray.push(link)
                currentKey = currentKey + 1
            } else if (operator === "<=" && sol) {
                for (let j = trace.length - 1; j >= 0; j--) {
                    if (trace[j].level === level - 1 && trace[j].operator === "<=") {
                        from = trace[j].key
                        break;
                    }
                }
                for (let j = trace.length - 1; j >= 0; j--) {
                    if (trace[j].level === level - 1) {
                        if (trace[j].operator === "<=") {
                            text = "true"
                        } else {
                            text = "false"
                        }
                        break;
                    }
                }
                link = {
                    "from": from,
                    "to": currentKey,
                    "text": text
                }
                linkDataArray.push(link)
                link = {
                    "from": currentKey,
                    "to": currentKey + 1,
                    "text": "true"
                }
                linkDataArray.push(link)
                currentKey = currentKey + 1
            } else if (operator === "<=") {
                for (let j = trace.length - 1; j >= 0; j--) {
                    if (trace[j].level === level - 1 && trace[j].operator === "<=") {
                        from = trace[j].key
                        break;
                    }
                }
                for (let j = trace.length - 1; j >= 0; j--) {
                    if (trace[j].level === level - 1) {
                        if (trace[j].operator === "<=") {
                            text = "true"
                        } else {
                            text = "false"
                        }
                        break;
                    }
                }
                link = {
                    "from": from,
                    "to": currentKey,
                    "text": text
                }
                linkDataArray.push(link)
            }

        }


        currentKey = currentKey + 1
    }

    console.log(trace)
    console.log("nodeDataArray")
    console.log(nodeDataArray)
    console.log("rules")
    console.log(rules)
    console.log("linkDataArray")
    console.log(linkDataArray)

    let diagram = {
        "diagram": {
            "class": "GraphLinksModel",
            "nodeDataArray": nodeDataArray,
            "linkDataArray": linkDataArray,
        },
        "rules": rules,
        "variables": arrayAttributes
    }

    return diagram

}

exports.computeWekaOutput = function (req, res) {
    console.log(req.body.wekaOutput)
    console.log(req.body.idgen)
    let wekaOutput = req.body.wekaOutput
    let diagram = wekaToJson(wekaOutput)

    let query = { 'idgen': req.body.idgen }
    let newDiagram = diagram.diagram
    let newRules = diagram.rules
    let variables = diagram.variables
    // newDiagram = JSON.parse(newDiagram)
    Diagnostic.findOneAndUpdate(query, { diagram: newDiagram, rules: newRules,published: false, variables: variables }, { upsert: true }, function (err) {
        if (err) {
            console.log(err)
            return res.send(500, { error: err })
        }
        let data = {
            response: 'Succesfully imported diagram in diagnostic.'
        }
        return res.send(data)
    });
}

//primeste id-ul diagramei
//sterge din bd documentul si toate detaliile lui
exports.removeDiagnostic = function (req,res){
    let query = {'idgen': req.body.idgen}
    Diagnostic.findOneAndRemove(query, function(err){
        if(err){
            console.log(err)
            return res.send(500, { error: err })
        }
        let data = {
                response: 'Succesfully removed diagram in diagnostic.'
        }
        return res.send(data)
    })
}