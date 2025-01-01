const jwt = require('jsonwebtoken');

// Middleware per a validar el token:

const verifyToken = (req, res, next) => {
    // Llegir el token del header de la petició:
    const token = req.get('authorization');

    // Comprovar que rebem el token:
    if (!token) {
        return res.status(401).json({
            error: 'Access denied'
        })
    };

    try{
        // Eliminar el prefix 'Bearer' del token:
        const tokenWithoutBearer = token.substring(7);
        // Validar el token:
        const verified = jwt.verify(tokenWithoutBearer, process.env.SECRET);
        // Assignar el token verificat a la propietat 'user' de la petició:
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({
            error: 'Invalid token'
        });
    };
}

module.exports = verifyToken;