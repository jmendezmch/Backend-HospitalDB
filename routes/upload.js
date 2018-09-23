let express = require('express');
let mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
let fs = require('fs');
let app = express();

app.use(fileUpload());
let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
let tiposValidos = ['hospitales', 'medicos', 'usuarios'];

let Usuario = require('../models/usuario');
let Medico = require('../models/medico');
let Hospital = require('../models/hospital');

const { verificaToken } = require('../middlewares/autenticacion');


app.put('/:tipo/:id', (req, res) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No hay archivos'
        });

    }

    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no valida'
        });
    }

    let tipo = req.params.tipo;
    let id = req.params.id;
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extensionArchivo}`;

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'coleccion no valida'
        });
    }
    let path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err,
                    message: 'Error al mover el archivo'
                });
            subirPorTipo(tipo, id, nombreArchivo, res);
        })
        // res.json({
        //     ok: true,
        //     hospitales: respuestas[0],
        //     medicos: respuestas[1],
        //     usuarios: respuestas[2]
        // });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            let pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':(';
                return res.json({
                    ok: true,
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            let pathViejo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.json({
                    ok: true,
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            let pathViejo = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.json({
                    ok: true,
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;