const express = require("express");
const cookieParser = require('cookie-parser');
const authMiddleware = require(__dirname + '/routes/auth-middleware.js');
const nunjucks = require("nunjucks");
require('dotenv').config();

const app = express();

// MIDDLEWARES DE BODY PARSER:

app.use(express.json()); // Per a poder llegir JSON del body de les peticions.
app.use(express.urlencoded({ extended: true })); // Per a poder llegir les peticions per URL (formularis HTML).

// MIDDLEWARE DE GESTIÓ DE COOKIES:

app.use(cookieParser());

// MIDDLEWARES D'AUTENTICACIÓ:

app.use(authMiddleware.verifyToken); // Verifica el token de l'usuari en totes les rutes (si n'hi ha).
app.use(authMiddleware.attachUser); // Posa la info de l'usuari a disposició de totes les vistes (si n'hi ha).

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
  .connect(process.env.MONGO_URI + "/" + process.env.MONGO_DB_NAME)
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
