const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 2
    }
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;