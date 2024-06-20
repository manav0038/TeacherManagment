const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    fullName: String,
    age: Number,
    dateOfBirth: Date,
    numberOfClasses: Number
});

module.exports = mongoose.model('Teacher', teacherSchema);
