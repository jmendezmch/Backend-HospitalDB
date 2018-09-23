let express = require('express');
let mongoose = require('mongoose');

let app = express();

let Usuario = require('../models/usuario');
let Medico = require('../models/medico');
let Hospital = require('../models/hospital');

const { verificaToken } = require('../middlewares/autenticacion');


app.get('/todo/:busqueda', (req, res, next) => {
    let busqueda = req.params.busqueda;
    let regexp = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regexp),
        buscarMedicos(busqueda, regexp),
        buscarUsuario(busqueda, regexp)
    ]).then(respuestas => {
        res.json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

});

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    let busqueda = req.params.busqueda;
    let coleccion = req.params.tabla;
    let regexp = new RegExp(busqueda, 'i');

    switch (coleccion) {
        case 'usuario':
            var promesa = buscarUsuario(busqueda, regexp);
            // buscarUsuario(busqueda, regexp).then(usuarios => {
            //     res.json({
            //         ok: true,
            //         busqueda,
            //         usuarios
            //     });
            // });
            break;
        case 'hospital':
            var promesa = buscarHospitales(busqueda, regexp);

            // buscarHospitales(busqueda, regexp).then(hospitales => {
            //     res.json({
            //         ok: true,
            //         hospitales
            //     });
            // });
            break;
        case 'medico':
            var promesa = buscarMedicos(busqueda, regexp);

            // buscarMedicos(busqueda, regexp).then(medicos => {
            //     res.json({
            //         ok: true,
            //         medicos
            //     });
            // });
            break;
        default:
            return res.json({
                ok: false,
                message: 'Coleccion no encontrada'
            });
            break;
    }

    promesa.then(data => {
        res.json({
            ok: true,
            [coleccion]: data
        });
    })






});

function buscarHospitales(busqueda, regexp) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regexp })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regexp) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regexp })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos');
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuario(busqueda, regexp) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or({ 'nombre': regexp }, { 'email': regexp }).exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios');
                } else {
                    resolve(usuarios);
                }
            });
    });
}
module.exports = app;