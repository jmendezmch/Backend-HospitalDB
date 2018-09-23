let express = require('express');
let mongoose = require('mongoose');

let app = express();
let Medico = require('../models/medico');

const { verificaToken } = require('../middlewares/autenticacion');

app.get('/', (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 5;
    Medico.find({})
        .limit(hasta)
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudieron obtener los medico',
                    err
                });
            }
            Medico.count({}, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    medicos
                });
            });
        })
});

app.post('/', verificaToken, (req, res) => {
    let body = req.body;

    let user_id = req.usuario._id;

    let medico = new Medico({
        nombre: body.nombre,
        // img: body.img,
        usuario: user_id,
        hospital: body.hospital
    });

    medico.save((err, response) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo guardar el medico',
                err
            });
        }
        return res.json({
            ok: true,
            medico: response
        });

    });
});

app.put('/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;
    let user_id = req.usuario._id;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo Actualizar el medico',
                err
            });
        }
        medico.nombre = body.nombre;
        // medico.img = body.img;
        if (body.hospital) {
            medico.hospital = body.hospital;
        }
        medico.usuario = user_id;
        medico.save((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudo actualizar el medico',
                    err
                });
            }
            return res.json({
                ok: true,
                medico: response
            });

        });
    })


});


app.delete('/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo borrar el medico',
                err
            });
        }

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                message: 'No existe el medico para eliminar'
            });
        }
        return res.json({
            ok: true,
            medico
        });
    });
})



module.exports = app;