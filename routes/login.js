let express = require('express');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let app = express();
let SEED = require('../config/config').SEED;
let Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo ingresar al sistema',
                err
            });
        }
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no existe'
            });
        }
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            if (!usuario) {
                return res.status(404).json({
                    ok: false,
                    message: 'Password incorrecto'
                });
            }
        }
        usuario.password = ':)';
        // Crear token
        // jwt.sign()
        console.log(usuario);
        let token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 });

        return res.json({
            ok: true,
            token,
            usuario
        })
    });
});

module.exports = app;