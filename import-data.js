// SCRIPT PER A MIGRAR EL LLISTAT DE PEL·LÍCULES DE L'ARXIU JSON A MONGODB:

const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Genre = require('./models/Genre');

// 1. Connectem amb la BD de MongoDB:
mongoose.connect('mongodb://127.0.0.1:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        // 2. Plenem la col·lecció de Gèneres amb alguns gèneres per defecte:
        const genresList = ['Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy'];
        await Genre.insertMany(genresList.map(title => ({ title })))
            .then(() => console.log('Genres added successfully'))
            .catch(err => console.error('Error adding genres:', err))
        ;

        // 3. Obtenim els gèneres amb els seus ObjectIds:
        const genres = await Genre.find({});
        const genreMap = genres.reduce((acc, genre) => {
            acc[genre.title] = genre._id;
            return acc;
        }, {});

        // 3. Plenem la col·lecció de Pel·lícules amb les pelis de l'arxiu JSON:
        const movies = require('./movies.json').map(movie => {
            movie.genre = movie.genre.map(name => genreMap[name]);
            return movie;
        });
        await Movie.insertMany(movies);
        console.log('Movies added successfully');
    })
    .catch(err => {
        console.error('Error:', err);
        mongoose.connection.close();
    })
    .finally(() => {
        mongoose.connection.close();
    })
;