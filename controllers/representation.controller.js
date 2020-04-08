const Representation = require ('../models/representation.model')

exports.test = function (req, res) {
    res.send('Representation Schema: Greetings from the Test controller!')
};

exports.create = function(req,res){
    console.log(req.body)
    console.log(req.body.dname)
    let representation = new Representation (
        {
            dname: req.body.dname,
            key: req.body.key,
            parent: req.body.parent,
            name: req.body.name,
        }
    )

    representation.save(function(err){
        if (err) {
            console.log("Error while saving, " + err)
            res.send("Error while saving, " + err)
        }
        res.send('Representation created successfully')
    })
}

exports.get_by_name = function(req, res){
    var query = Representation.where({dname: req.body.name})
    query.findOne(function(err, representation){
        if (err){
            console.log("Error while executing get_by_name. " + err)
            res.send("Error while executing get_by_name. " + err)
        }
        res.send(representation)
    })
}
