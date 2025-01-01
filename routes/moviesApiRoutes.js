const express = require("express");
let router = express.Router();
const moviesApiController = require("../controllers/moviesApiController");
const verifyToken = require("../routes/validate-token");

// Retornar la llista de pelis (filtrades o no):
router.get("/", verifyToken, moviesApiController.getMovies);

// Retornar una peli segons l'ID:
router.get("/:id", verifyToken, moviesApiController.getMovieById);

// Afegir una nova peli:
router.post("/", verifyToken, moviesApiController.addMovie);

// Modificar una peli:
router.patch("/:id", verifyToken, moviesApiController.editMovie);

// Eliminar una peli:
router.delete('/:id', verifyToken, moviesApiController.deleteMovie);

module.exports = router;
