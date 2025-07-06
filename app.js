const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const router = require('./rutas'); // ahora incluye todo: API + vistas

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const pathProducts = './datos/products.json';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Usar un único router para todo
app.use('/', router);

// WebSocket + lógica
app.set('socketio', io);

io.on('connection', socket => {
  console.log('🟢 Cliente conectado por websocket');

  socket.on('new-product', productData => {
    try {
      const data = fs.readFileSync(pathProducts, 'utf-8');
      const products = JSON.parse(data);

      const newId = products.length > 0
        ? Math.max(...products.map(p => typeof p.id === 'number' ? p.id : parseInt(p.id))) + 1
        : 1;

      const newProduct = {
        id: newId,
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        desc: productData.desc || '',
        tipe: productData.tipe || '',
        status: productData.status !== undefined ? productData.status : true
      };

      products.push(newProduct);
      fs.writeFileSync(pathProducts, JSON.stringify(products, null, 2));

      io.emit('update-products');
    } catch (err) {
      console.error('Error al agregar producto desde websocket:', err);
    }
  });

  socket.on('delete-product', id => {
    try {
      const data = fs.readFileSync(pathProducts, 'utf-8');
      const products = JSON.parse(data);

      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        fs.writeFileSync(pathProducts, JSON.stringify(products, null, 2));
      }

      io.emit('update-products');
    } catch (err) {
      console.error('Error al eliminar producto desde websocket:', err);
    }
  });
});

// Iniciar servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
