const fs = require('fs');
const pathCarrito = './datos/cart.json';

///////////////////////////////////////
//Crear Carrito
///////////////////////////////////////
function crearCarrito(req, res) {
  try {
    const data = fs.readFileSync(pathCarrito, 'utf-8');
    const carritos = JSON.parse(data);

    // Generar ID único de carrito
    const nuevoId = carritos.length > 0
      ? Math.max(...carritos.map(c => typeof c.id === 'number' ? c.id : parseInt(c.id))) + 1
      : 1;

    // Crear nuevo carrito
    const nuevoCarrito = {
      id: nuevoId,
      productos: []
    };

    carritos.push(nuevoCarrito);
    
    // Guardar en archivo
    fs.writeFileSync(pathCarrito, JSON.stringify(carritos, null, 2));

    res.status(201).json({ mensaje: 'Carrito creado', carrito: nuevoCarrito });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear el carrito' });
  }
}

///////////////////////////////////////
//Insertar en Carrito
///////////////////////////////////////
function agregarProductoAlCarrito(req, res) {
    const carritoId = parseInt(req.params.cid);
    const productoId = parseInt(req.params.pid);
  
    try {
      const data = fs.readFileSync(pathCarrito, 'utf-8');
      const carritos = JSON.parse(data);
  
      const carrito = carritos.find(c => c.id === carritoId);
  
      if (!carrito) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
      }
  
      // Buscar si el producto ya está en el carrito
      const productoEnCarrito = carrito.productos.find(p => p.id === productoId);
  
      if (productoEnCarrito) {
        // Si el producto ya está → sumar 1
        productoEnCarrito.quantity += 1;
      } else {
        // Si el producto no está → agregar con quantity 1
        carrito.productos.push({ id: productoId, quantity: 1 });
      }
  
      // Guardar cambios
      fs.writeFileSync(pathCarrito, JSON.stringify(carritos, null, 2));
  
      res.status(200).json({ mensaje: 'Producto agregado al carrito', carrito });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al agregar el producto al carrito' });
    }
  }
  //falta ver si no existe el id del producto

///////////////////////////////////////
//Listar Carrito
///////////////////////////////////////
function obtenerCarritoPorId(req, res) {
    const carritoId = parseInt(req.params.cid);
  
    try {
      const data = fs.readFileSync(pathCarrito, 'utf-8');
      const carritos = JSON.parse(data);
  
      const carrito = carritos.find(c => c.id === carritoId);
  
      if (!carrito) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
      }
  
      res.json({ productos: carrito.productos });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al leer el carrito' });
    }
  }

/////////////////////////////////
//Borrar carrito
/////////////////////////////////
function eliminarCarrito(req, res) {
  const carritoId = parseInt(req.params.cid);

  try {
    const data = fs.readFileSync(pathCarrito, 'utf-8');
    const cart = JSON.parse(data);

    //Busco el carritp por id
    const index = cart.findIndex(c => c.id === carritoId);
    //Si no existe ese id...
    if (index === -1) {
      return res.status(404).json({ mensaje: `Carrito con ID ${carritoId} no encontrado` });
    }

    const carritoEliminado = cart.splice(index, 1)[0];

    fs.writeFileSync(pathCarrito, JSON.stringify(cart, null, 2));

    res.json({ mensaje: 'Carrito eliminado con éxito', carrito: carritoEliminado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar el carrito' });
  }
}
/////////////////////////////////

///////////////////////////////////////
//Export funciones
///////////////////////////////////////
module.exports = {
    crearCarrito,
    agregarProductoAlCarrito,
    obtenerCarritoPorId,
    eliminarCarrito
    //Aca agrego mas funciones
};