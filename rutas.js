const express = require('express');
const fs = require('fs');
const router = express.Router();

// Path a datos de productos para vistas
const pathProducts = './datos/products.json';

const servicioProducts = require('./servicios/servicioProducts');
const servicioCarts = require('./servicios/servicioCarts');

/////////////////////////////////
// Sección Views
/////////////////////////////////
router.get('/', (req, res) => {
  const data = fs.readFileSync(pathProducts, 'utf-8');
  const products = JSON.parse(data);
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

/////////////////////////////////
// Sección Products
/////////////////////////////////
router.get('/products', servicioProducts.listProducts);

router.get('/products/:id', servicioProducts.showProduct);

router.post('/products', servicioProducts.addProducto);

router.put('/products/:id', servicioProducts.refreshProduct);

router.delete('/products/:id', servicioProducts.deletedProduct);

router.patch('/products/:id/:status', servicioProducts.changeStatusProduct);

/////////////////////////////////
// Sección Carts
/////////////////////////////////
router.post('/carts', servicioCarts.createCart);

router.post('/carts/:cid/product/:pid', servicioCarts.addProductCart);

router.get('/carts/:cid', servicioCarts.obtainCartById);

router.delete('/carts/:cid', servicioCarts.deletCart);

/////////////////////////////////

module.exports = router;
