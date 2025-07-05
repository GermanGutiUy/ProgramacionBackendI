const express = require('express');

const router = express.Router();

const servicioProducts = require('./servicios/servicioProducts');
const servicioCarts = require('./servicios/servicioCarts');

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
