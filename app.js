const express = require("express"); // Per a crear el servidor web.
const nunjucks = require("nunjucks"); // Per a renderitzar les plantilles (vistes).

const app = express();
app.use(express.json()); // Per a poder llegir JSON del body de les peticions.
app.use(express.urlencoded({ extended: true })); // Per a poder llegir les peticions per URL (formularis HTML).

// CONFIGURACIÓ DE NUNJUCKS:

app.set("view engine", "njk"); // Establim que les plantilles són de tipus Nunjucks.
nunjucks.configure("views", {
  autoescape: true, // Evita que s'injecte codi JavaScript.
  express: app, // Indica que les plantilles s'han de renderitzar amb Express.
});

// RUTES:

const moviesApiRouter = require("./routes/moviesApiRoutes");
const moviesRouter = require("./routes/moviesRoutes");

// CONNEXIÓ AMB LA BD:

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/movies")
  .then(() => console.log("S'ha establert la connexió a MongoDB."))
  .catch((err) =>
    console.error("No s'ha pogut establir la connexió a MongoDB.", err)
  );

// ENDPOINTS:

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
