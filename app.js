const express = require("express"); // Per a crear el servidor web.
const nunjucks = require("nunjucks"); // Per a renderitzar les plantilles (vistes).
const jwt = require('jsonwebtoken'); // Per a generar i verificar JWT (JSON Web Tokens).

const app = express();
app.use(express.json()); // Per a poder llegir JSON del body de les peticions.
app.use(express.urlencoded({ extended: true })); // Per a poder llegir les peticions per URL (formularis HTML).

// SIMULACIÓ D'USUARIS EXISTENTS:

const usuaris = [
  { usuari: 'nacho', password: '12345', rol: 'admin' },
  { usuari: 'pepe', password: 'pepe111', rol: 'normal' }
];

// MIDDLEWARES D'AUTENTICACIÓ:

const secret = "secretNode";

let generarToken = login => {
    return jwt.sign({login: login}, secret, {expiresIn: "2 hours"});
};

let protegirRuta = (req, res, next) => {
  let token = req.headers['authorization'];
  if (validarToken(token))
      next();
  else
      res.send({ok: false, error: "Usuari no autoritzat"});
};

let validarToken = (token) => {
  try {
      let resultat = jwt.verify(token.substring(7), secret);
      return resultat;
  } catch (e) {}
};

// CONFIGURACIÓ DE NUNJUCKS (VISTES):

app.set("view engine", "njk"); // Establim que les plantilles són de tipus Nunjucks.
nunjucks.configure("views", {
  autoescape: true, // Evita que s'injecte codi JavaScript.
  express: app, // Indica que les plantilles s'han de renderitzar amb Express.
});

// IMPORTACIÓ DE RUTES:

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

app.get("/", (req, res) => {
  res.send({ ok: true, resultat: "Benvingut a la nostra aplicació de pel·lícules." });
});

app.get('/protegit', protegirRuta, (req, res) => {
  res.send({ ok: true, resultat: "Benvingut a la zona protegida." });
});

app.post('/login', (req, res) => {
  let usuari = req.body.usuari;
  let password = req.body.password;

  let existeixUsuari = usuaris.filter(u => 
      u.usuari == usuari && u.password == password);

  if (existeixUsuari.length == 1)
      res.send({ok: true, token: generarToken(usuari)});
  else
      res.send({ok: false});
});

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
