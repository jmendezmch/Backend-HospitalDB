let express = require('express');
let mongoose = require('mongoose');

let app = express();

app.listen(3000, () => {
    console.log('Backend server inicializado');
});

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Conexion a Mongo OK');
})


app.get('/', (req, res, next) => {
    res.json({
        ok: true
    })
})