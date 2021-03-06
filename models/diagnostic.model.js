const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useFindAndModify', false);

let DiagnosticSchema  = new Schema({
    name: {type: String},
    link: {type: String},
    published: {type: Boolean},
    description: {type: String},
    idgen: {type: String},
    rules: [{
        idnode: String,
        nodeType: String,
        rule: [{
            variable: String,
            operator: String,
            parameter: String,
            description: String
            }]
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