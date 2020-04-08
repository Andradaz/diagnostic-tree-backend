const mongoose = require('mongoose')
const Schema = mongoose.Schema

let RepresentationSchema = new Schema({
    dname: {type: String},
    key: {type: []},
    parent: {type: []},
    name: [],
});

module.exports = mongoose.model('Representation',RepresentationSchema)