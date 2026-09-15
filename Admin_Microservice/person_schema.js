const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    emailid: String,
    pass: String,
    mobile: String,
    role: String
});

const PersonModel = mongoose.model('Person', personSchema);

module.exports = PersonModel;