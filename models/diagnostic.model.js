const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useFindAndModify', false);

let DiagnosticSchema  = new Schema({
    name: {type: String},
    link: {type: String},
    publish: {type: String},
    idgen: {type: String},
    rules: [{
        idnode: String,
        variable: String,
        operator: String,
        parameter: String
    }],
    variables: [],
    diagram: [{
        class: String,
        nodeDataArray: [{
            name: String,
            key: String,
            color: String
        }
        ],
        linkDataArray: [{
            from: String,
            to: String,
            text: Boolean
        }]
    }
    ]
});

module.exports = mongoose.model('Diagnostic', DiagnosticSchema)