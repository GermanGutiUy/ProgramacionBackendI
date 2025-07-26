const express = require('express');
const fs = require('fs');
const router = express.Router();

const controllersProducts = require('./controllers/controllersProducts');
const controllersCarts = require('./controllers/controllersCarts');

/////////////////////////////////
// Sección Views
/////////////////////////////////
router.get('/', controllersProducts.listProducts); // Vista paginada con productos

router.get('/realtimeproducts', (req, res) => {
  try {
    const data = fs.readFileSync('./datos/products.json', 'utf-8');
    const products = JSON.parse(data);
    res.render('realTimeProducts', { products });
  } catch (err) {
    console.error('Error leyendo products.json:', err);
    res.render('realTimeProducts', { products: [] });
  }
});

/////////////////////////////////
// Sección API
/////////////////////////////////
router.get('/api/products', controllersProducts.listProducts); // ← API JSON con paginación

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

// Nuevas rutas para carritos (paso 3)
router.delete('/api/carts/:cid/products/:pid', controllersCarts.deleteProductFromCart);

router.put('/api/carts/:cid/products/:pid', controllersCarts.updateProductQuantity);

router.put('/api/carts/:cid', controllersCarts.updateCartProducts);

router.delete('/api/carts/:cid', controllersCarts.clearCart);

/////////////////////////////////

module.exports = router;
