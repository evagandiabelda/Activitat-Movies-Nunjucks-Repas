const jwt = require('jsonwebtoken');

// MIDDLEWARE PER A VERIFICAR EL TOKEN I PASSAR L'USUARI A LA SESSIÓ:

const verifyToken = (req, res, next) => {
    // Llegir el token del header de la petició:
    const token = req.get('authorization');

    // Comprovar que rebem el token:
    if (!token) {
        return res.status(401).json({
            error: 'Access denied'
        })
    }

    try {
        // Eliminar el prefix 'Bearer ' del token:
        const tokenWithoutBearer = token.substring(7);

        // Validar el token:
        const verified = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);

        req.user = verified;

        next();
    } catch (error) {
        res.status(400).json({
            error: 'Invalid token'
        })
    }
}

// MIDDLEWARE PER A PASSAR L'USUARI A LES VISTES:

const attachUser = (req, res, next) => {
    const token = req.cookies.access_token;

    if (token) {
        try {
            const user = jwt.verify(token, process.env.SECRET);
            res.locals.user = user; // Usuario accesible para vistas
        } catch (err) {
            console.error('Error al verificar el token:', err.message);
            res.locals.user = null; // Si el token no es válido, no hay usuario
        }
    } else {
        res.locals.user = null; // Si no hay token, no hay usuario
    }

    next();
};

// MIDDLEWARE PER COMPROVAR SI L'USUARI ESTÀ LOGUEJAT:

const loggedIn = (req, res, next) => {
    if (req.locals.user) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = {
    verifyToken,
    loggedIn,
    attachUser
}