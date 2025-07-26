const Cart = require('../models/Cart');
const Product = require('../models/Product');

///////////////////////////////////////
// Crear carrito (vacío)
///////////////////////////////////////
async function createCart(req, res) {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ msj: 'Carrito creado', cart: newCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al crear el carrito' });
  }
}

///////////////////////////////////////
// Agregar producto al carrito (sumar qty si ya existe)
///////////////////////////////////////
async function addProductCart(req, res) {
  try {
    const { cid, pid } = req.params;

    // Verificar que exista el producto
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ msj: 'Producto no encontrado' });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ msj: 'Carrito no encontrado' });

    const prodInCart = cart.products.find(p => p.product.toString() === pid);

    if (prodInCart) {
      prodInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ msj: 'Producto agregado al carrito', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al agregar producto al carrito' });
  }
}

///////////////////////////////////////
// Obtener carrito por id (con productos poblados)
///////////////////////////////////////
async function obtainCartById(req, res) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ msj: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al obtener carrito' });
  }
}

///////////////////////////////////////
// Eliminar carrito completo
///////////////////////////////////////
async function deletCart(req, res) {
  try {
    const { cid } = req.params;
    const deleted = await Cart.findByIdAndDelete(cid);
    if (!deleted) return res.status(404).json({ msj: 'Carrito no encontrado' });
    res.json({ msj: 'Carrito eliminado con éxito', cart: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al eliminar el carrito' });
  }
}

///////////////////////////////////////
// Eliminar producto del carrito
///////////////////////////////////////
async function deleteProductFromCart(req, res) {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ msj: 'Carrito no encontrado' });

    const beforeLength = cart.products.length;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    if (cart.products.length === beforeLength) {
      return res.status(404).json({ msj: 'Producto no encontrado en el carrito' });
    }

    await cart.save();
    res.json({ msj: 'Producto eliminado del carrito', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al eliminar producto del carrito' });
  }
}

///////////////////////////////////////
// Actualizar cantidad de un producto en el carrito
///////////////////////////////////////
async function updateProductQuantity(req, res) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity == null || quantity < 1) {
      return res.status(400).json({ msj: 'Cantidad inválida' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ msj: 'Carrito no encontrado' });

    const prodInCart = cart.products.find(p => p.product.toString() === pid);
    if (!prodInCart) return res.status(404).json({ msj: 'Producto no encontrado en el carrito' });

    prodInCart.quantity = quantity;

    await cart.save();
    res.json({ msj: 'Cantidad actualizada', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al actualizar cantidad' });
  }
}

///////////////////////////////////////
// Actualizar todos los productos del carrito con un arreglo nuevo
///////////////////////////////////////
async function updateCartProducts(req, res) {
  try {
    const { cid } = req.params;
    const { products } = req.body; // debe ser arreglo [{ product: id, quantity }]

    if (!Array.isArray(products)) {
      return res.status(400).json({ msj: 'Products debe ser un arreglo' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ msj: 'Carrito no encontrado' });

    // Validar que todos los productos existan
    for (const item of products) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({ msj: 'Producto o cantidad inválidos en el arreglo' });
      }
      const productExists = await Product.findById(item.product);
      if (!productExists) {
        return res.status(404).json({ msj: `Producto con ID ${item.product} no existe` });
      }
    }

    cart.products = products.map(p => ({
      product: p.product,
      quantity: p.quantity
    }));

    await cart.save();
    res.json({ msj: 'Carrito actualizado', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al actualizar el carrito' });
  }
}

///////////////////////////////////////
// Vaciar carrito (eliminar todos los productos)
///////////////////////////////////////
async function clearCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ msj: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();
    res.json({ msj: 'Carrito vaciado', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al vaciar el carrito' });
  }
}

///////////////////////////////////////
// Exportar funciones
///////////////////////////////////////
module.exports = {
  createCart,
  addProductCart,
  obtainCartById,
  deletCart,
  deleteProductFromCart,
  updateProductQuantity,
  updateCartProducts,
  clearCart
};
