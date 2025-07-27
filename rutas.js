const express = require('express');
const router = express.Router();

const controllersProducts = require('./controllers/controllersProducts');
const controllersCarts = require('./controllers/controllersCarts');

/////////////////////////////////
// Sección Views
/////////////////////////////////

// Renderizar listado de productos con paginación usando Handlebars
router.get('/productos', async (req, res) => {
  try {
    const data = await controllersProducts.listProductsRender(req);
    res.render('home', data); // 'home' es el archivo .handlebars que compartiste
  } catch (error) {
    console.error('Error al renderizar productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Vista de carritos
router.get('/carts', (req, res) => {
  res.render('products'); // Usamos products.handlebars para la gestión de carritos
});

// Vista de carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await controllersCarts.obtainCartByIdRender(cid);
    res.render('cart', cart);
  } catch (error) {
    console.error('Error al renderizar carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Vista de producto específico
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await controllersProducts.showProductRender(pid);
    res.render('productDetail', product);
  } catch (error) {
    console.error('Error al renderizar producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Vista de productos en tiempo real
router.get('/realtime', (req, res) => {
  res.render('realTimeProducts');
});

// Redirigir la raíz a /productos
router.get('/', (req, res) => {
  res.redirect('/productos');
});

/////////////////////////////////
// API Productos
/////////////////////////////////

// Listar productos en JSON
router.get('/api/products', controllersProducts.listProducts);

// Agregar nuevo producto (POST)
router.post('/api/products', controllersProducts.addProducto);

// Obtener producto por ID (ejemplo)
router.get('/api/products/:id', controllersProducts.showProduct);

// Actualizar producto
router.put('/api/products/:id', controllersProducts.refreshProduct);

// Eliminar producto
router.delete('/api/products/:id', controllersProducts.deletedProduct);

// Cambiar status producto
router.patch('/api/products/:id/status/:status', controllersProducts.changeStatusProduct);

/////////////////////////////////
// API Carritos (ejemplo)
/////////////////////////////////

router.post('/api/carts', controllersCarts.createCart);
router.post('/api/carts/:cid/products/:pid', controllersCarts.addProductCart);
router.get('/api/carts/:cid', controllersCarts.obtainCartById);
router.delete('/api/carts/:cid', controllersCarts.deletCart);
router.delete('/api/carts/:cid/products/:pid', controllersCarts.deleteProductFromCart);
router.put('/api/carts/:cid/products/:pid', controllersCarts.updateProductQuantity);
router.put('/api/carts/:cid', controllersCarts.updateCartProducts);
router.delete('/api/carts/:cid/clear', controllersCarts.clearCart);

/////////////////////////////////
// Exportar router
/////////////////////////////////

module.exports = router;
