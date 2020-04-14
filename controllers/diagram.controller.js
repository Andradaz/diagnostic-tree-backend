const Diagram = require('../models/diagram.model')

exports.diagramCreate = function (req,res){
    let diagram = new Diagram (
        {
            name: req.body.name,
            link: req.body.link,
            published: req.body.published
        }
    )

    diagram.save(function(err){
        if (err) {
            console.log("Error while saving, " + err)
            res.send("Error while saving, " + err)
        }
        res.send('Diagram created successfully')
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

exports.setStatus = function (req,res){
    //primeste name si published(true/false)
    let query = { 'name': req.body.name }
    let status = req.body.published

    Diagram.findOneAndUpdate(query, { published: status }, { upsert: true }, function (err) {
        if (err) return res.send(500, { error: err })
        return res.send('Succesfully set diagram published status.')
    });
}

