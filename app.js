const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const router = require('./rutas');

//////////////////////////////
//Conexión a MongoDB
//////////////////////////////
mongoose.connect('mongodb+srv://germangutierrezrial6:2rgxoa2ztGxvZbrW@cluster0.ifalnwv.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🟢 MongoDB conectado'))
.catch(err => console.error('❌ Error conexión MongoDB:', err));


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const pathProducts = './datos/products.json';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars con helper
const handlebars = exphbs.create({
  helpers: {
    json: function(context) {
      return JSON.stringify(context);
    },
    eq: function(a, b) {
      return a === b;
    },
    range: function(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    formatPrice: function(price) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(price);
    },
    formatDate: function(date) {
      return new Date(date).toLocaleDateString('es-AR');
    },
    truncate: function(str, length) {
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    }
  }
});

// Configuración Handlebars (v5)
app.engine('handlebars', handlebars.engine); // <-- aquí la corrección que ya tenías
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Router
app.use('/', router);

// WebSocket
app.set('socketio', io);

const {
  addProductFromSocket,
  updateProductFromSocket,
  deleteProductFromSocket
} = require('./controllers/controllersProducts');

io.on('connection', socket => {
  console.log('🟢 Cliente conectado por websocket');

  socket.on('new-product', productData => {
    try {
      addProductFromSocket(productData);
      io.emit('update-products');
    } catch (err) {
      console.error('❌ Error al agregar producto vía socket:', err);
      socket.emit('error', { msg: err.message });
    }
  });

  socket.on('update-product', updatedProduct => {
    try {
      updateProductFromSocket(updatedProduct);
      io.emit('update-products');
    } catch (err) {
      console.error('❌ Error al actualizar producto vía socket:', err);
      socket.emit('error', { msg: err.message });
    }
  });

  socket.on('delete-product', id => {
    try {
      deleteProductFromSocket(id);
      io.emit('update-products');
    } catch (err) {
      console.error('❌ Error al eliminar producto vía socket:', err);
      socket.emit('error', { msg: err.message });
    }
  });
});

// Servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
