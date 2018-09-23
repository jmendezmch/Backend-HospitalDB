let express = require('express');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let app = express();
let SEED = require('../config/config').SEED;
let Usuario = require('../models/usuario');

const { verificaToken } = require('../middlewares/autenticacion');


app.get('/', verificaToken, (req, res, next) => {

    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 5;


    Usuario.find({}, 'nombre email img role')
        .limit(hasta)
        .skip(desde)
        .exec((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudieron obtener los usuarios',
                    err
                });
            }
            Usuario.count({}, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    usuarios: response
                });
            })

        })
});

app.put('/:id', verificaToken, (req, res) => {
    let user_id = req.params.id;
    let body = req.body;
    // console.log(body);
    Usuario.findById(user_id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no existe'
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo actualizar el usuario',
                    err
                });
            }

            return res.json({
                ok: true,
                usuario: usuarioDB
            });
        });
    });
});

app.post('/', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo crear el usuario',
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/:id', verificaToken, (req, res) => {
    let user_id = req.params.id;

    Usuario.findByIdAndDelete(user_id, (err, usuarioDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo eliminar el usuario',
                err
            });
        }
        if (!usuarioDelete) {
            return res.status(404).json({
                ok: false,
                message: 'No existe el usuario para eliminar'
            });
        }
        return res.json({
            ok: true,
            usuario: usuarioDelete
        });
    });
});

module.exports = app;