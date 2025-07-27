const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Product = require('../models/product'); // Asegurate que el nombre del archivo/modelo esté bien (mayúscula/minúscula)
const Cart = require('../models/cart');

// 👉 Esta es tu URI real que usaste en app.js:
const MONGO_URI = 'mongodb+srv://germangutierrezrial6:2rgxoa2ztGxvZbrW@cluster0.ifalnwv.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

async function loadData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📡 Conectado a MongoDB');

    // Cargar productos
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../datos/products.json'), 'utf-8')
    );
    await Product.deleteMany(); // Limpiamos antes
    await Product.insertMany(productsData);
    console.log(`✅ ${productsData.length} productos insertados.`);

    // Cargar carritos
    const cartsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../datos/cart.json'), 'utf-8')
    );
    await Cart.deleteMany(); // Limpiamos antes
    await Cart.insertMany(cartsData);
    console.log(`✅ ${cartsData.length} carritos insertados.`);

  } catch (err) {
    console.error('❌ Error cargando datos:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

loadData();
