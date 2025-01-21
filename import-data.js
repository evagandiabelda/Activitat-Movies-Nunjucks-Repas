// SCRIPT PER A MIGRAR EL LLISTAT DE PEL·LÍCULES DE L'ARXIU JSON A MONGODB (executar "node import-data.js" des de la terminal):

const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Genre = require('./models/Genre');

// Connectem amb la BD de MongoDB:
mongoose.connect('mongodb://127.0.0.1:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        // 1. Eliminem totes les col·leccions de la BD:
        console.log('Deleting old data...');

        await Genre.deleteMany({})
            .then(() => console.log('Old genres list deleted successfully.'))
            .catch(err => console.error('Error deleting old genres list:', err));
        await Movie.deleteMany({})
            .then(() => console.log('Old movies list deleted successfully.'))
            .catch(err => console.error('Error deleting old movies list:', err));

        console.log('Adding new data...');

        // 2. Plenem la col·lecció de Gèneres amb alguns gèneres per defecte:
        const genresList = ['Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy'];
        await Genre.insertMany(genresList.map(title => ({ title })))
            .then(() => console.log('New genres list added successfully'))
            .catch(err => console.error('Error adding new genres list:', err))
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
        await Movie.insertMany(movies)
            .then(() => console.log('New movies list added successfully'))
            .catch(err => console.error('Error adding new movies list:', err));
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
        mongoose.connection.close();
    })
    .finally(() => {
        mongoose.connection.close();
    })
    ;