const mongoose = require('mongoose')
const Schema = mongoose.Schema

let DiagramSchema = new Schema({
    name: {type: String, required: true, max: 40}
});

module.exports = mongoose.model('Diagram', DiagramSchema)

