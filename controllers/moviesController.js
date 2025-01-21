const {
  getMoviesService,
  getMovieByIdService,
  addMovieService,
  editMovieService,
  deleteMovieService,
} = require("../services/movieService");

const Genre = require("../models/Genre");
const { get } = require("mongoose");

// ---------------------------------------------------------
// GETMOVIES: Retornar el llistat de pelis (filtrades o no):
// ---------------------------------------------------------

getMovies = async (req, res) => {
  try {
    const filteredMovies = await getMoviesService(req);
    const success = req.query.success;
    res.render("movies/llistar", { movies: filteredMovies, success });
  } catch (error) {
    res.render('error', { error });
  }
};

// -----------------------------------------------------------
// SHOWFORMAFEGIR: Mostrar el formulari per a afegir una peli:
// -----------------------------------------------------------

showFormAfegir = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.render("movies/formulari-afegir", { genres: genres });
  } catch (error) {
    res.render('error', { error });
  }
};

// -----------------------------------------------------------
// SHOWFORMEDITAR: Mostrar el formulari per a editar una peli:
// -----------------------------------------------------------

showFormEditar = async (req, res) => {
  try {
    const movie = await getMovieByIdService(req);
    const genres = await Genre.find();
    res.render("movies/formulari-editar", { movie: movie, genres: genres });
  } catch (error) {
    res.render('error', { error });
  }
};

// --------------------------------------------
// GETMOVIEBYID: Retornar una peli segons l'ID:
// --------------------------------------------

getMovieById = async (req, res) => {
  try {
    const foundMovie = await getMovieByIdService(req);
    res.render("movies/detall", { movie: foundMovie });
  } catch (error) {
    res.render('error', { error });
  }
};

// -------------------------------
// ADDMOVIE: Afegir una nova peli:
// -------------------------------

addMovie = async (req, res) => {
  try {
    await addMovieService(req);
    res.redirect("/movies?success=Pel·lícula afegida correctament.");
  } catch (error) {
    if (error.name === "ValidationError") {
      // Si és un error de validació, tornem a mostrar el formulari amb els errors:
      const genres = await Genre.find();
      res.render("movies/formulari-afegir", { genres: genres, errors: error.errors });
    } else {
      // Per a altres errors, mostrem la pàgina d'error:
      res.render("error", { error });
    }
  }
};

// ------------------------------
// EDITMOVIE: Modificar una peli:
// ------------------------------

editMovie = async (req, res) => {
  try {
    await editMovieService(req);
    res.redirect("/movies?success=Pel·lícula modificada correctament.");
  } catch (error) {
    if (error.name === "ValidationError") {
      // Si és un error de validació, tornem a mostrar el formulari amb els errors:
      const movie = await getMovieByIdService(req);
      const genres = await Genre.find();
      res.render("movies/formulari-editar", { genres: genres, movie, errors: error.errors });
    } else {
      // Per a altres errors, mostrem la pàgina d'error:
      res.render("error", { error });
    }
  }
};

// -------------------------------
// DELETEMOVIE: Eliminar una peli:
// -------------------------------

deleteMovie = async (req, res) => {
  try {
    // No assignem res a la variable perquè no ens interessa el resultat.
    await deleteMovieService(req);
    res.redirect("/movies?success=Pel·lícula eliminada correctament.");
  } catch (error) {
    res.render('error', { error });
  }
};

module.exports = {
  getMovies,
  showFormAfegir,
  showFormEditar,
  getMovieById,
  addMovie,
  editMovie,
  deleteMovie,
};
