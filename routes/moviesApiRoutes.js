const express = require("express");
let router = express.Router();
const moviesApiController = require("../controllers/moviesApiController");
const { verifyToken } = require("./auth-middleware");

// Retornar la llista de pelis (filtrades o no):
router.get("/", moviesApiController.getMovies);

// Retornar una peli segons l'ID:
router.get("/:id", moviesApiController.getMovieById);

// Afegir una nova peli:
router.post("/", moviesApiController.addMovie);

// Modificar una peli:
router.patch("/:id", moviesApiController.editMovie);

// Eliminar una peli:
router.delete('/:id', verifyToken, moviesApiController.deleteMovie);

module.exports = router;
