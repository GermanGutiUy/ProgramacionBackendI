const express = require('express');
const fs = require('fs');
const router = express.Router();

// Path a datos de productos para vistas
const pathProducts = './datos/products.json';

const controllersProducts = require('./controllers/controllersProducts');
const controllersCarts = require('./controllers/controllersCarts');

/////////////////////////////////
// Sección Views
/////////////////////////////////
router.get('/', (req, res) => {
  const data = fs.readFileSync(pathProducts, 'utf-8');
  const products = JSON.parse(data);
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  try {
    const data = fs.readFileSync(pathProducts, 'utf-8');
    const products = JSON.parse(data);
    res.render('realTimeProducts', { products });  // <--- Aquí pasamos los productos a la vista
  } catch (err) {
    console.error('Error leyendo products.json:', err);
    res.render('realTimeProducts', { products: [] });
  }
});

router.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(pathProducts, 'utf-8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (err) {
    console.error('Error leyendo products.json:', err);
    res.json([]);
  }
});

/////////////////////////////////
// Sección Products
/////////////////////////////////
router.get('/products', controllersProducts.listProducts);

router.get('/products/:id', controllersProducts.showProduct);

router.post('/products', controllersProducts.addProducto);

router.put('/products/:id', controllersProducts.refreshProduct);

router.delete('/products/:id', controllersProducts.deletedProduct);

router.patch('/products/:id/:status', controllersProducts.changeStatusProduct);

/////////////////////////////////
// Sección Carts
/////////////////////////////////
router.post('/carts', controllersCarts.createCart);

router.post('/carts/:cid/product/:pid', controllersCarts.addProductCart);

router.get('/carts/:cid', controllersCarts.obtainCartById);

router.delete('/carts/:cid', controllersCarts.deletCart);

/////////////////////////////////

module.exports = router;
