const Movie = require("../models/Movie");
const Genre = require("../models/Genre");

// ---------------------------------------------------------
// GETMOVIES: Retornar el llistat de pelis (filtrades o no):
// ---------------------------------------------------------

getMoviesService = async (req) => {
  try {
    // 1. RECOLLIR LES POSSIBLES DADES DE LA QUERY:
    const {
      genre,
      title,
      year,
      director,
      duration: maxDuration,
      rate: minRate,
      isFavorite,
      ordenar,
    } = req.query;

    // 2. FILTRAR:

    // Ací emmagatzemarem els possibles filtres. Si no hi ha cap, tornarà TOTES les pelis:
    const filters = {};

    // Búsqueda parcial mitjançant RegExp ('i' = 'case-insensitive'):
    if (title) filters.title = new RegExp(title, "i");
    if (director) filters.director = new RegExp(director, "i");

    // Conversió a integer:
    if (year) filters.year = parseInt(year);

    // Conversió a integer (es comprova si és menor o igual):
    if (maxDuration) filters.duration = { $lte: parseInt(maxDuration) };

    // Conversió a float (es comprova si és major o igual):
    if (minRate) filters.rate = { $gte: parseFloat(minRate) };

    // Búsqueda per ObjectId:
    if (genre) {
      const genreDoc = await Genre.findOne({ title: new RegExp(genre, "i") });
      if (genreDoc) filters.genre = genreDoc._id;
    }

    // Búsqueda per boolean:
    if (isFavorite !== undefined) filters.isFavorite = isFavorite;

    // 4. TORNAR EL LLISTAT DE PEL·LÍCULES:

    /* return Movie.find(filters).sort({ title: 1 }); */
    return await Movie.find(filters);

  } catch (error) {
    throw new Error("No s'han pogut obtindre les pel·lícules.");
  }
};

// -----------------------------------------------------------
// GETORDEREDMOVIES: Retornar el llistat de pelis (ordenades):
// -----------------------------------------------------------

getOrderedMoviesService = async (req) => {
  try {
    const orderedMovies = await Movie.find().sort({ title: 1 });
    return orderedMovies;
  } catch (error) {
    throw new Error("No s'han pogut obtindre les pel·lícules ordenades.");
  }
}

// --------------------------------------------
// GETMOVIEBYID: Retornar una peli segons l'ID:
// --------------------------------------------

getMovieByIdService = async (req) => {
  try {
    const { id } = req.params;
    const foundMovie = await Movie.findById(id).populate("genre"); // "populate" per a obtenir el nom dels gèneres, ja que pertanyen a un altre model.

    if (!foundMovie) {
      throw new Error("No s'ha trobat la pel·lícula.");
    }

    return foundMovie;
  } catch (error) {
    throw new Error("Error al obtindre la pel·lícula.");
  }
};

// -------------------------------
// ADDMOVIE: Afegir una nova peli:
// -------------------------------

addMovieService = async (req) => {
  try {
    const { title, year, director, duration, poster, genre, rate } = req.body;

    // 1. VALIDEM ELS CAMPS OBLIGATORIS:
    // "rate" no es valida com a "!rate" per a permetre que 0 siga un valor vàlid.
    if (
      !title ||
      !year ||
      !director ||
      !duration ||
      !genre ||
      rate === undefined
    ) {
      throw new Error("Tots els camps són obligatoris.");
    }

    // 2. AFEGIM NOVA PELI A LA BD:
    const newMovie = await Movie.create({
      title,
      year: Number(year),
      director,
      duration: Number(duration),
      poster,
      genre,
      rate: Number(rate),
      isFavorite: false,
    });

    return newMovie;
  } catch (error) {
    // Si és un error de validació, el llancem per a mostrar-lo al formulari:
    if (error.name === "ValidationError") {
      throw error;
    };
    // Si és un altre tipus d'error, llancem un error genèric:
    throw new Error("No s'ha pogut guardar la pel·lícula.");
  }
};

// ------------------------------
// EDITMOVIE: Modificar una peli:
// ------------------------------

editMovieService = async (req) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convertim a número:
    if (updates.year !== undefined) updates.year = Number(updates.year);
    if (updates.duration !== undefined) updates.duration = Number(updates.duration);
    if (updates.rate !== undefined) updates.rate = Number(updates.rate);

    // "new: true" -> Fa els canvis i retorna el document actualitzat.
    // Si no s'especifica, retorna l'anterior i hi hauria que fer una altra consulta.
    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedMovie) {
      throw new Error("No s'ha trobat la pel·lícula.");
    }

    return updatedMovie;
  } catch (error) {
    // Si és un error de validació, el llancem per a mostrar-lo al formulari:
    if (error.name === "ValidationError") {
      throw error;
    };
    // Si és un altre tipus d'error, llancem un error genèric:
    throw new Error("No s'ha pogut actualitzar la pel·lícula.");
  }
};

// -------------------------------
// DELETEMOVIE: Eliminar una peli:
// -------------------------------

deleteMovieService = async (req) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      throw new Error("No s'ha trobat la pel·lícula.");
    }

    // No fa falta retornar la pel·lícula eliminada, ja que no la necessitem.
  } catch (error) {
    throw new Error("No s'ha pogut eliminar la pel·lícula.");
  }
};

module.exports = {
  getMoviesService,
  getOrderedMoviesService,
  getMovieByIdService,
  addMovieService,
  editMovieService,
  deleteMovieService,
};
