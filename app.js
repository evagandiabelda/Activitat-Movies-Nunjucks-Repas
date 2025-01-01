const express = require("express"); // Per a crear el servidor web.
const nunjucks = require("nunjucks"); // Per a renderitzar les plantilles (vistes).
const jwt = require('jsonwebtoken'); // Per a generar i verificar JWT (JSON Web Tokens).
const cookieParser = require('cookie-parser'); // Per a llegir i escriure cookies.
require('dotenv').config(); // Per a llegir les variables d'entorn del fitxer .env.

const app = express();
app.use(express.json()); // Per a poder llegir JSON del body de les peticions.
app.use(express.urlencoded({ extended: true })); // Per a poder llegir les peticions per URL (formularis HTML).

// VARIABLES D'ENTORN:

const mongoUri = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB_NAME;
const secret = process.env.SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION;

// MIDDLEWARES D'AUTENTICACIÓ:

const authMiddleware = require(__dirname + '/routes/auth-middleware.js');
app.use(authMiddleware.verifyCookieToken); // S'aplica a totes les rutes.

// MIDDLEWARE DE GESTIÓ DE COOKIES:

app.use(cookieParser());

// CONFIGURACIÓ DE NUNJUCKS (VISTES):

app.set("view engine", "njk"); // Establim que les plantilles són de tipus Nunjucks.
nunjucks.configure("views", {
  autoescape: true, // Evita que s'injecte codi JavaScript.
  express: app, // Indica que les plantilles s'han de renderitzar amb Express.
});

// IMPORTACIÓ DE RUTES:

const usersRouter = require("./routes/usersRoutes");
const moviesApiRouter = require("./routes/moviesApiRoutes");
const moviesRouter = require("./routes/moviesRoutes");

// CONNEXIÓ AMB LA BD:

const mongoose = require("mongoose");
mongoose
  .connect(mongoUri + "/" + mongoDbName)
  .then(() => console.log("S'ha establert la connexió a MongoDB."))
  .catch((err) =>
    console.error("No s'ha pogut establir la connexió a MongoDB.", err)
  );

// ENDPOINTS:

app.use("/users", usersRouter);

app.use("/api/movies", moviesApiRouter);
app.use("/movies", moviesRouter);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Ruta no trobada" });
});

app.use((req, res) => {
  res.status(404).render("error", { error: "Ruta no trobada" });
});

// PORT:
app.listen(8080);
