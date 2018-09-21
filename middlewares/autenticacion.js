let jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;


exports.verificaToken = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Invalid Token',
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
}