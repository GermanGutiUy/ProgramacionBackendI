const express = require('express');

const router = express.Router();

const servicioProducts = require('./servicios/servicioProducts');

const servicioCarts = require('./servicios/servicioCarts');

/////////////////////////////////
//Section Produts
/////////////////////////////////
router.get('/products', servicioProducts.listarProducts);

router.get('/products/:id', servicioProducts.mostrarProduct);

router.post('/products', servicioProducts.agregarProducto);

router.put('/products/:id', servicioProducts.actualizarProducto);

router.delete('/products/:id', servicioProducts.eliminarProducto);

router.patch('/products/:id/:status', servicioProducts.cambiarEstadoProducto);
/////////////////////////////////

/////////////////////////////////
//Section Cart
/////////////////////////////////

router.post('/carts', servicioCarts.crearCarrito);

router.post('/carts/:cid/product/:pid', servicioCarts.agregarProductoAlCarrito);

router.get('/carts/:cid', servicioCarts.obtenerCarritoPorId);

router.delete('/carts/:cid', servicioCarts.eliminarCarrito);
/////////////////////////////////

module.exports = router;