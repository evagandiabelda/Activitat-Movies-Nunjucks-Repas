const jwt = require('jsonwebtoken');

// MIDDLEWARE PER A VERIFICAR EL TOKEN I PASSAR L'USUARI A LA SESSIÓ:

const verifyToken = (req, res, next) => {
    // Llegir el token del header de la petició:
    const token = req.cookies.access_token;

    // Si no hi ha token, es crea una sessió per defecte amb l'usuari a null:
    if (!token) {
        req.locals.user = null;
        return next();
    }

    // Validar el token:
    try{
        const verified = jwt.verify(token, process.env.SECRET);
        req.locals.user = verified;
    }catch(err){
        console.error('Error al verificar el token:', err.message);
        req.locals.user = null; // Si no hi ha token, no hi ha usuari.
    }

    next();
}

// MIDDLEWARE PER A PASSAR L'USUARI A LES VISTES:

const attachUser = (req, res, next) => {
    res.locals.user = req.locals.user;
    next();
};

// MIDDLEWARE PER COMPROVAR SI L'USUARI ESTÀ LOGUEJAT:

const loggedIn = (req, res, next) => {
    if (req.locals.user){
        next();
    }else{
        res.redirect('/users/login');
    }
}

module.exports = {
    verifyToken,
    loggedIn,
    attachUser
}