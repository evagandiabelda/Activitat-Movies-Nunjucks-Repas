const express = require("express");
let router = express.Router();
const usersController = require('../controllers/usersController.js');

// Loguejar un usuari:
router.post('/',usersController.loginUser);

// Registrar un usuari:
router.post('/register',usersController.registerUser);

// Tancar la sessió d'un usuari:
router.post('/logout',usersController.logoutUser);

module.exports = router;