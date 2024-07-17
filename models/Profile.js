const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    skills: [String],
    experience: Number,
    location: String
});

module.exports = mongoose.model('Profile', profileSchema);
