const bcrypt = require('bcrypt'); // Per a encriptar contrasenyes.
const jwt = require('jsonwebtoken'); // Per a generar i verificar JWT (JSON Web Tokens).

const User = require(__dirname + '/../models/User');

// ---------
//  LOG IN:
// ---------

exports.loginUser = async (req, res) => {
    const {username, password} = req.body;

    // Trobar l'usuari a la BD:
    const user = await User.findOne({username});

    // Comparar contrasenya amb la de la BD:
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    // Si l'usuari no existeix o la contrasenya no és correcta:
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    };

    // Crear el payload del token:
    const payload = {
        username: user.username,
        id: user._id
    };

    const SECRET = process.env.SECRET;
    const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

    // Crear el token:
    const token = jwt.sign(
        payload,
        SECRET,
        {expiresIn: TOKEN_EXPIRATION}
    );

    // Guardar el token a les cookies del client:
    res.cookie('access_token', token, {
        httpOnly: true, // La cookie no es pot llegir amb JavaScript des del client (només des del servidor).
        // secure: true,   // La cookie només es pot enviar per HTTPS (per a producció).
        maxAge: 1000 * 60 * 60 // La cookie expira en 1 hora.
    }).send({username: user.username, token});
};

// ----------
//  SIGN IN:
// ----------

exports.registerUser = async (req, res) => {
    const {username, password} = req.body;

    // Encriptar la contrasenya:
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds); //

    // Crear un nou usuari:
    const user = new User({
        username,
        passwordHash
    });

    // Guardar-lo a la BD:
    const savedUser = 
        await user.save()
        .catch((error) => {
            res.status(400).json({
                error: error.message
            });
        }
    );

    // Retornar el nom de l'usuari creat (sense el "passwordHash"):
    res.send({
        username: savedUser.username
    });
};

// ----------
//  LOG OUT::
// ----------

exports.logoutUser = (req, res) => {
    res.clearCookie('access_token').redirect('/');
};