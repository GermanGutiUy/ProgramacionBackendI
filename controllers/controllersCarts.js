const fs = require('fs');
const pathCart = './datos/cart.json';

///////////////////////////////////////
//Crear Carrito
///////////////////////////////////////
function createCart(req, res) {
  try {
    const data = fs.readFileSync(pathCart, 'utf-8');
    const carts = JSON.parse(data);

    // Generar ID único de carrito
    const nuevoId = carts.length > 0
      ? Math.max(...carts.map(c => typeof c.id === 'number' ? c.id : parseInt(c.id))) + 1
      : 1;

    // Crear nuevo carrito
    const newCart = {
      id: nuevoId,
      products: []
    };

    carts.push(newCart);
    
    // Guardar en archivo
    fs.writeFileSync(pathCart, JSON.stringify(carts, null, 2));

    res.status(201).json({ msj: 'Carrito creado', cart: newCart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al crear el carrito' });
  }
}

///////////////////////////////////////
//Insertar en Carrito
///////////////////////////////////////
function addProductCart(req, res) {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  try {
    const data = fs.readFileSync(pathCart, 'utf-8');
    const carts = JSON.parse(data);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ msj: 'Carrito no encontrado' });
    }

    // Buscar si el producto ya está en el carrito
    const productInCart = cart.products.find(p => p.id === productId);

    if (productInCart) {
      // Si el producto ya está → sumar 1
      productInCart.quantity += 1;
    } else {
      // Si el producto no está → agregar con quantity 1
      cart.products.push({ id: productId, quantity: 1 });
    }

    // Guardar cambios
    fs.writeFileSync(pathCart, JSON.stringify(carts, null, 2));

    res.status(200).json({ msj: 'Producto agregado al carrito', cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al agregar el producto al carrito' });
  }
}
// falta ver si no existe el id del producto

///////////////////////////////////////
//Listar Carrito
///////////////////////////////////////
function obtainCartById(req, res) {
  const cartId = parseInt(req.params.cid);

  try {
    const data = fs.readFileSync(pathCart, 'utf-8');
    const carts = JSON.parse(data);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ msj: 'Carrito no encontrado' });
    }

    res.json({ products: cart.products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al leer el carrito' });
  }
}

/////////////////////////////////
//Borrar carrito
/////////////////////////////////
function deletCart(req, res) {
  const cartId = parseInt(req.params.cid);

  try {
    const data = fs.readFileSync(pathCart, 'utf-8');
    const cart = JSON.parse(data);

    //Busco el carrito por id
    const index = cart.findIndex(c => c.id === cartId);
    //Si no existe ese id...
    if (index === -1) {
      return res.status(404).json({ msj: `Carrito con ID ${cartId} no encontrado` });
    }

    const cartDeleted = cart.splice(index, 1)[0];

    fs.writeFileSync(pathCart, JSON.stringify(cart, null, 2));

    res.json({ mensaje: 'Carrito eliminado con éxito', cart: cartDeleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al eliminar el carrito' });
  }
}

///////////////////////////////////////
//Export funciones
///////////////////////////////////////
module.exports = {
  createCart,
  addProductCart,
  obtainCartById,
  deletCart
  //Aca agrego mas funciones
};