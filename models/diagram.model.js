const mongoose = require('mongoose')
const Schema = mongoose.Schema

let DiagramSchema = new Schema({
    name: {type: String, required: true, max: 40},
    link: {type: String, required: true, max:3},
    index: {type: Number, required: true}
});

module.exports = mongoose.model('Diagram', DiagramSchema)

 