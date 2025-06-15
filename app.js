const express = require('express'); //Import librerias

const router = require('./rutas'); //Import librerias

const PORT = 8080;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
    console.log("Servidor iniciado.");
});

app.use('/api',router);
