const Diagram = require('../models/diagram.model')

exports.test = function (req, res) {
    res.send('Greetings from the Test controller!')
};

exports.diagram_create = function (req,res){
    let diagram = new Diagram (
        {
            name: req.body.name,
            link: req.body.link
        }
    )

    diagram.save(function(err){
        if (err) {
            console.log("Error while saving, " + err)
            res.send("Error while saving, " + err)
        }
        res.send('Product created successfully')
    })
};

exports.diagram_details = function (req, res){
    Diagram.findById(req.params.id, function(err, diagram){
        if (err){
            console.log("Error while extracting data. " + err)
            res.send("Error while extracting data. " + err)
        }
        res.send(diagram)
    })
};

exports.list = function (req, res){
    Diagram.find(function(err, diagrams){
        if (err) {
            console.log("Error while extracting list. " + err)
            res.send("Error while extracting list. " + err)
        }
        res.send(diagrams)
    })
}
