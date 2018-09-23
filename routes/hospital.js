let express = require('express');
let mongoose = require('mongoose');

let app = express();
let Hospital = require('../models/hospital');

const { verificaToken } = require('../middlewares/autenticacion');

app.get('/', (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 5;
    Hospital.find({})
        .limit(hasta)
        .skip(desde)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudieron obtener los hospitales',
                    err
                });
            }
            Hospital.count({}, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    hospitales
                });
            });
        })
});

app.post('/', verificaToken, (req, res) => {
    let body = req.body;

    let user_id = req.usuario._id;

    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: user_id
    });

    hospital.save((err, response) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo guardar el hospital',
                err
            });
        }
        return res.json({
            ok: true,
            hospital: response
        });

    });
});

app.put('/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;


    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo Actualizar el hospital',
                err
            });
        }
        hospital.nombre = body.nombre;
        // hospital.img = body.img;
        hospital.usuario = req.usuario._id;
        hospital.save((err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudo guardar el hospital',
                    err
                });
            }
            return res.json({
                ok: true,
                hospital: response
            });

        });
    })


});


app.delete('/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo borrar el hospital',
                err
            });
        }

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                message: 'No existe el hospital para eliminar'
            });
        }
        return res.json({
            ok: true,
            hospital
        });
    });
})



module.exports = app;