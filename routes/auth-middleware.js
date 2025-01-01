const jwt = require('jsonwebtoken');

// MIDDLEWARE PER A VERIFICAR EL TOKEN I PASSAR L'USUARI A LA SESSIÓ:

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

// MIDDLEWARE PER COMPROVAR SI L'USUARI ESTÀ LOGUEJAT:

const loggedIn = (req, res, next) => {
    if (req.session.user){
        next();
    }else{
        res.redirect('/users/login');
    }
}

// MIDDLEWARE PER PASSAR L'USUARI A LES VISTES:

const attachUser = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const user = jwt.verify(token, process.env.SECRET);
            res.locals.user = user; // Fer l'usuari accessible a les vistes.
        } catch (err) {
            console.error('Error al verificar el token:', err.message);
            res.locals.user = null; // Si el token no és vàlid, no hi ha usuari.
        }
    } else {
        res.locals.user = null; // Si no hi ha token, no hi ha usuari.
    }

    next();
};

module.exports = {
    verifyToken,
    loggedIn,
    attachUser
}