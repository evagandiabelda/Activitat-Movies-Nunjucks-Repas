const express = require("express");
let router = express.Router();
const moviesController = require("../controllers/moviesController");
const authMiddleware = require("./auth-middleware");

// Retornar la llista de pelis (filtrades o no):
router.get("/", moviesController.getMovies);

// Retornar la llista de pelis (ordenades):
router.get("/ordered", moviesController.getOrderedMovies);

// Mostrar el formulari per a afegir una nova peli:
router.get("/form-afegir", moviesController.showFormAfegir);

// Mostrar el formulari per a editar una nova peli:
router.get("/form-editar/:id", moviesController.showFormEditar);

// Retornar una peli segons l'ID:
router.get("/:id", moviesController.getMovieById);

// Afegir una nova peli:
router.post("/", moviesController.addMovie);

// Modificar una peli:
router.post("/patch/:id", moviesController.editMovie); // Es canvia "patch" per "post" per a que el formulari no done problemes.

// Eliminar una peli:
router.post("/delete/:id", authMiddleware.loggedIn, moviesController.deleteMovie); // Es canvia "delete" per "post" per a que el formulari no done problemes.

module.exports = router;
