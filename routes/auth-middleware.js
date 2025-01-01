const jwt = require('jsonwebtoken');

// Middleware per a validar el token i guardar la sessió:

const verifyToken = (req, res, next) => {
    // Llegir el token del header de la petició:
    const token = req.cookies.access_token;

    // Crear una sessió per defecte amb l'usuari a null:
    req.session = { user: null};

    // Validar el token:
    try{
        const verified = jwt.verify(token, process.env.SECRET);
        req.session.user = verified;
    }catch(error){
        return res.render('error', {error});
    }

    next();
}

// Middleware per comprovar si l'usuari està autenticat i no deixar passar:

exports.loggedIn = (req, res, next) => {
    if (req.session.user){
        next();
    }else{
        res.redirect('/users/login');
    }
}

module.exports = verifyToken;