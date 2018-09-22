let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

let app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);

app.listen(3000, () => {
    console.log('Backend server inicializado');
});

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('Conexion a Mongo OK');
})