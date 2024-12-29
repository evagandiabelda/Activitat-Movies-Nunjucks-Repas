const {
  getMoviesService,
  getMovieByIdService,
  addMovieService,
  editMovieService,
  deleteMovieService,
} = require("../services/movieService");

// ---------------------------------------------------------
// GETMOVIES: Retornar el llistat de pelis (filtrades o no):
// ---------------------------------------------------------

getMovies = async (req, res) => {
  try {
    const filteredMovies = await getMoviesService(req);
    res.json(filteredMovies);
  } catch (error) {
    res.status(500).json({ error: "No s'han pogut obtindre les pel·lícules." });
  }
};

// --------------------------------------------
// GETMOVIEBYID: Retornar una peli segons l'ID:
// --------------------------------------------

getMovieById = async (req, res) => {
  try {
    const foundMovie = await getMovieByIdService(req);
    res.json(foundMovie);
  } catch (error) {
    // Depenent de l'error que es produeixca, retornarem un missatge o un altre:
    if (error.message === "No s'ha trobat la pel·lícula.") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al obtindre la pel·lícula." });
    }
  }
};

// -------------------------------
// ADDMOVIE: Afegir una nova peli:
// -------------------------------

addMovie = async (req, res) => {
  try {
    const newMovie = await addMovieService(req);
    res
      .status(201)
      .json({ message: "Pel·lícula afegida correctament.", movie: newMovie });
  } catch (error) {
    // Depenent de l'error que es produeixca, retornarem un missatge o un altre:
    if (error.message === "Tots els camps són obligatoris.") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "No s'ha pogut guardar la pel·lícula." });
    }
  }
};

// ------------------------------
// EDITMOVIE: Modificar una peli:
// ------------------------------

editMovie = async (req, res) => {
  try {
    const updatedMovie = await editMovieService(req);
    res.status(200).json({
      message: "Pel·lícula actualitzada correctament.",
      movie: updatedMovie,
    });
  } catch (error) {
    // Depenent de l'error que es produeixca, retornarem un missatge o un altre:
    if (error.message === "No s'ha trobat la pel·lícula.") {
      res.status(404).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ error: "No s'ha pogut actualitzar la pel·lícula." });
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
    res.status(200).json({ message: "Pel·lícula eliminada correctament." });
  } catch (error) {
    res.status(500).json({ error: "No s'ha pogut eliminar la pel·lícula." });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  editMovie,
  deleteMovie,
};
