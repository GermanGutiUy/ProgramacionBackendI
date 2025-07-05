const fs = require('fs');

const path = "./datos/products.json";

///////////////////////////////////////
// Listar todos los productos
///////////////////////////////////////
function listProducts(req, res) {
  const products = fs.readFileSync(path, 'utf-8');
  const productsJson = JSON.parse(products);
  console.log(productsJson);
  res.json(productsJson);
}

///////////////////////////////////////
// Listar producto por ID
///////////////////////////////////////
function showProduct(req, res) {
  const productId = parseInt(req.params.id);
  console.log(productId);
  const products = fs.readFileSync(path, 'utf-8');
  const productJson = JSON.parse(products);
  const product = productJson.filter(item =>
    item.id === productId
  );
  if (!product || product.length === 0) {
    return res.status(404).json({ msj: 'Producto no encontrado' });
  }
  console.log(product);
  res.json(product);
}

///////////////////////////////////////
// Agregar producto (POST)
///////////////////////////////////////
function addProducto(req, res) {
  const { name, stock, desc, tipe, price, status } = req.body;

  if (!name || stock == null || !desc || !tipe || price == null) {
    return res.status(400).json({ msj: 'Faltan campos obligatorios' });
  }

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const products = JSON.parse(data);

    const newId = products.length > 0
      ? Math.max(...products.map(p => typeof p.id === 'number' ? p.id : parseInt(p.id))) + 1
      : 1;

    const newProduct = {
      id: newId,
      name,
      stock,
      desc,
      tipe,
      price,
      status: status !== undefined ? status : true
    };

    products.push(newProduct);

    fs.writeFileSync(path, JSON.stringify(products, null, 2));

    res.status(201).json({ msj: 'Producto agregado', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al guardar el producto' });
  }
}

///////////////////////////////////////
// Actualizar producto (PUT)
///////////////////////////////////////
function refreshProduct(req, res) {
  const productId = parseInt(req.params.id);
  const campRefresh = req.body;

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const products = JSON.parse(data);

    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ msj: `Producto con ID ${productId} no encontrado` });
    }

    if ('id' in campRefresh) {
      delete campRefresh.id;
    }

    products[index] = {
      ...products[index],
      ...campRefresh
    };

    fs.writeFileSync(path, JSON.stringify(products, null, 2));

    res.json({ msj: 'Producto actualizado con éxito', product: products[index] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al actualizar el producto' });
  }
}

///////////////////////////////////////
// Eliminar producto (DELETE)
///////////////////////////////////////
function deletedProduct(req, res) {
  const productId = parseInt(req.params.id);

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const products = JSON.parse(data);

    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ msj: `Producto con ID ${productId} no encontrado` });
    }

    const productDeleted = products.splice(index, 1)[0];

    fs.writeFileSync(path, JSON.stringify(products, null, 2));

    res.json({ msj: 'Producto eliminado con éxito', product: productDeleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al eliminar el producto' });
  }
}

///////////////////////////////////////
// Cambiar status del producto
///////////////////////////////////////
function changeStatusProduct(req, res) {
  const productId = parseInt(req.params.id);
  const statusParam = req.params.status;
  let status;

  if (statusParam === 'true') {
    status = true;
  } else if (statusParam === 'false') {
    status = false;
  } else {
    return res.status(400).json({ msj: 'Debes enviar un valor booleano en "status"' });
  }

  try {
    const data = fs.readFileSync(path, 'utf-8');
    const products = JSON.parse(data);

    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ msj: `Producto con ID ${productId} no encontrado` });
    }

    products[index].status = status;

    fs.writeFileSync(path, JSON.stringify(products, null, 2));

    res.json({ msj: `Status actualizado a ${status}`, product: products[index] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msj: 'Error al cambiar el estado del producto' });
  }
}

///////////////////////////////////////
// Export funciones
///////////////////////////////////////
module.exports = {
  listProducts,
  showProduct,
  addProducto,
  refreshProduct,
  deletedProduct,
  changeStatusProduct
  //Aca agrego mas funciones
};
