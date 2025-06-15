const { isUtf8 } = require('buffer');
const fs = require('fs');

const path = "./datos/products.json";

///////////////////////////////////////
//Listar todos los productos
///////////////////////////////////////
function listarProducts(req, res){
  const productos = fs.readFileSync(path,'utf-8');
  const productosJson = JSON.parse(productos);
  console.log(productosJson);
  res.json(productosJson);
};

///////////////////////////////////////
//Listar producto por id
///////////////////////////////////////
function mostrarProduct(req, res){
  const productoId = parseInt(req.params.id);
  console.log(productoId);
  const productos = fs.readFileSync(path,'utf-8');
  const productoJson = JSON.parse(productos);
  const producto = productoJson.filter(item => 
    item.id === productoId
  );
  // Si no encuentra el error
  if (!producto || producto.length === 0){
    return res.status(404).json({mensaje: 'Producto no encontrado'});
  }
  console.log(producto);
  res.json(producto);
};

///////////////////////////////////////
// Post products
///////////////////////////////////////
function agregarProducto(req, res) {
  const { nombre, stock, desc, tipo, precio, status } = req.body;

  // Validación básica de campos obligatorios
  if (!nombre || stock == null || !desc || !tipo || precio == null) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const productos = JSON.parse(data);

    // Generar un ID autoincremental único
    const nuevoId = productos.length > 0
      ? Math.max(productos.map(p => typeof p.id === 'number' ? p.id : parseInt(p.id))) + 1
      : 1;

      const nuevoProducto = {
        id: nuevoId,
        nombre,
        stock,
        desc,
        tipo,
        precio,
        status: status !== undefined ? status : true //Seteo status true
      };

    productos.push(nuevoProducto);

    fs.writeFileSync(path, JSON.stringify(productos, null, 2));

    res.status(201).json({ mensaje: 'Producto agregado', producto: nuevoProducto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al guardar el producto' });
  }
}

///////////////////////////////////////
//Actualizar prdocuto
///////////////////////////////////////
function actualizarProducto(req, res) {
  const productoId = parseInt(req.params.id);
  const camposActualizados = req.body;

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const productos = JSON.parse(data);
    
    // Buscar id en el json
    const index = productos.findIndex(p => p.id === productoId);
    //Si no existe ese id...
    if (index === -1) {
      return res.status(404).json({ mensaje: `Producto con ID ${productoId} no encontrado` });
    }

    // Evitar que se modifique el ID
    if ('id' in camposActualizados) {
      delete camposActualizados.id;
    }

    // Actualizar solo los campos que vienen en el body
    productos[index] = {
      ...productos[index],
      ...camposActualizados
    };

    // Guardar cambios
    fs.writeFileSync(path, JSON.stringify(productos, null, 2));

    res.json({ mensaje: 'Producto actualizado con éxito', producto: productos[index] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
}

///////////////////////////////////////
//Borrar prdocuto
///////////////////////////////////////
function eliminarProducto(req, res) {
  const productoId = parseInt(req.params.id);

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const productos = JSON.parse(data);

    //Busco el prodcuto por id
    const index = productos.findIndex(p => p.id === productoId);
    //Si no existe ese id...
    if (index === -1) {
      return res.status(404).json({ mensaje: `Producto con ID ${productoId} no encontrado` });
    }

    const productoEliminado = productos.splice(index, 1)[0];

    fs.writeFileSync(path, JSON.stringify(productos, null, 2));

    res.json({ mensaje: 'Producto eliminado con éxito', producto: productoEliminado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
}

///////////////////////////////////////
//Cambio Status del producto
///////////////////////////////////////
function cambiarEstadoProducto(req, res) {
  const productoId = parseInt(req.params.id);
  const statusParam = req.params.status;
  let status;

  if (statusParam === 'true') {
    status = true;
  }else if (statusParam === 'false'){
    status = false;
  } else {
    return res.status(400).json({ mensaje: 'Debes enviar un valor booleano en "status"' });
  }

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const productos = JSON.parse(data);

    const index = productos.findIndex(p => p.id === productoId);

    if (index === -1) {
      return res.status(404).json({ mensaje: `Producto con ID ${productoId} no encontrado` });
    }

    productos[index].status = status;

    fs.writeFileSync(path, JSON.stringify(productos, null, 2));

    res.json({ mensaje: `Status actualizado a ${status}`, producto: productos[index] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al cambiar el estado del producto' });
  }
}

///////////////////////////////////////
//Export funciones
///////////////////////////////////////
module.exports = {
    listarProducts,
    mostrarProduct,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto
    //Aca agrego mas funciones
};