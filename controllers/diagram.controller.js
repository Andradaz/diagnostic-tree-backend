const Diagram = require('../models/diagram.model')

exports.test = function (req, res) {
    res.send('Greetings from the Test controller!')
};

exports.diagram_create = function (req,res){
    let diagram = new Diagram (
        {
            name: req.body.name
        }
    )

    diagram.save(function(err){
        if (err) {
            return next(err)
        }
        res.send('Product created successfully')
    })
};

exports.diagram_details = function (req, res){
    Diagram.findById(req.params.id, function(err, diagram){
        if (err) return next(err)
        res.send(diagram)
    })
};
