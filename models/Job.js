const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: String,
    description: String,
    skillsRequired: [String],
    location: String,
    salary: Number
});

module.exports = mongoose.model('Job', jobSchema);
