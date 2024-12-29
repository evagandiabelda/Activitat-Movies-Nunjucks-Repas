const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El títol és obligatori.'],
        minlength: [2, 'El títol ha de tenir almenys 2 caràcters.']
    },
    year: {
        type: Number,
        required: [true, "L'any és obligatori."],
        min: [1880, "L'any ha de ser com a mínim 1880."],
        max: [2024, "L'any no pot ser superior a 2024."],
        validate: {
            validator: Number.isInteger,
            message: "L'any ha de ser un valor enter."
        }
    },
    director: {
        type: String,
        required: [true, 'El director és obligatori.'],
        minlength: [2, 'El nom del director ha de tenir almenys 2 caràcters.']
    },
    duration: {
        type: Number,
        required: [true, 'La duració és obligatòria.'],
        min: [3, 'La duració ha de ser com a mínim 3 minuts.'],
        max: [360, 'La duració no pot ser superior a 6 hores.'],
        validate: {
            validator: Number.isInteger,
            message: 'La duració ha de ser un valor enter.'
        }
    },
    poster: {
        type: String,
        minlength: [12, 'La URL del pòster ha de tenir almenys 12 caràcters.']
    },
    genre: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Genre',
        required: false,
        validate: {
            validator: (value) => Array.isArray(value) && value.every(val => mongoose.Types.ObjectId.isValid(val)),
            message: "Els gèneres han de ser una llista d'ObjectId vàlids"
        }
    },
    rate: {
        type: Number,
        required: [true, 'La puntuació és obligatòria.'],
        min: [0, 'La puntuació mínima és 0.'],
        max: [10, 'La puntuació màxima és 10.']
    }
});

// Middleware per a arredonir el valor de "rate" a 1 xifra decimal:
movieSchema.pre('save', function (next) {
    this.rate = Math.round(this.rate * 10) / 10;
    next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;