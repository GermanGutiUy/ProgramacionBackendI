// controllers/controllersProducts.js
const Product = require('../models/product');

///////////////////////////////////////
// Función para preparar datos para renderizado con Handlebars
///////////////////////////////////////
async function listProductsRender(req) {
  let { limit = 10, page = 1, sort, query } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);

  const filter = {};
  if (query) {
    if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
      filter.status = query.toLowerCase() === 'true';
    } else {
      filter.category = query;
    }
  }

  const sortOption = {};
  if (sort === 'asc') sortOption.price = 1;
  else if (sort === 'desc') sortOption.price = -1;

  const totalDocs = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalDocs / limit);

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();  // lean para que Handlebars pueda procesar

  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  // Construir enlaces de paginación
  const buildLink = (pageNum) => {
    const params = new URLSearchParams();
    if (limit !== 10) params.append('limit', limit);
    if (pageNum !== 1) params.append('page', pageNum);
    if (sort) params.append('sort', sort);
    if (query) params.append('query', query);
    return params.toString() ? `?${params.toString()}` : '';
  };

  return {
    payload: products,
    totalPages,
    prevPage: hasPrevPage ? page - 1 : null,
    nextPage: hasNextPage ? page + 1 : null,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink: hasPrevPage ? buildLink(page - 1) : null,
    nextLink: hasNextPage ? buildLink(page + 1) : null,
    limit,
    sort,
    query
  };
}

///////////////////////////////////////
// Listar productos para API JSON
///////////////////////////////////////
async function listProducts(req, res) {
  try {
    const data = await listProductsRender(req);
    res.json({
      status: 'success',
      ...data
    });
  } catch (err) {
    console.error('Error listando productos:', err);
    res.status(500).json({ status: 'error', message: 'Error listando productos' });
  }
}

///////////////////////////////////////
// Obtener producto por ID para renderizado
///////////////////////////////////////
async function showProductRender(pid) {
  try {
    const product = await Product.findById(pid).lean();
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return { product };
  } catch (err) {
    console.error('Error obteniendo producto para renderizado:', err);
    throw err;
  }
}

///////////////////////////////////////
// Obtener producto por ID
///////////////////////////////////////
async function showProduct(req, res) {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msj: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    console.error('Error obteniendo producto:', err);
    res.status(500).json({ msj: 'Error obteniendo producto' });
  }
}

///////////////////////////////////////
// Crear nuevo producto
///////////////////////////////////////
async function addProducto(req, res) {
  try {
    const { title, stock, description, category, price, status } = req.body;

    if (!title || stock == null || !description || !category || price == null) {
      return res.status(400).json({ msj: 'Faltan campos obligatorios' });
    }

    const newProduct = new Product({
      title,
      stock,
      description,
      category,
      price,
      status: status !== undefined ? status : true
    });

    await newProduct.save();

    res.status(201).json({ msj: 'Producto agregado', product: newProduct });
  } catch (err) {
    console.error('Error al guardar producto:', err);
    res.status(500).json({ msj: 'Error al guardar el producto' });
  }
}

///////////////////////////////////////
// Actualizar producto
///////////////////////////////////////
async function refreshProduct(req, res) {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    if ('id' in updateData) delete updateData.id;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) return res.status(404).json({ msj: 'Producto no encontrado' });

    res.json({ msj: 'Producto actualizado con éxito', product: updatedProduct });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ msj: 'Error al actualizar el producto' });
  }
}

///////////////////////////////////////
// Eliminar producto
///////////////////////////////////////
async function deletedProduct(req, res) {
  try {
    const productId = req.params.id;
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) return res.status(404).json({ msj: 'Producto no encontrado' });
    res.json({ msj: 'Producto eliminado con éxito', product: deleted });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ msj: 'Error al eliminar el producto' });
  }
}

///////////////////////////////////////
// Cambiar status producto (true/false)
///////////////////////////////////////
async function changeStatusProduct(req, res) {
  try {
    const productId = req.params.id;
    const statusParam = req.params.status;

    if (!['true', 'false'].includes(statusParam)) {
      return res.status(400).json({ msj: 'Status debe ser true o false' });
    }

    const status = statusParam === 'true';

    const updatedProduct = await Product.findByIdAndUpdate(productId, { status }, { new: true });

    if (!updatedProduct) return res.status(404).json({ msj: 'Producto no encontrado' });

    res.json({ msj: `Status actualizado a ${status}`, product: updatedProduct });
  } catch (err) {
    console.error('Error al cambiar status producto:', err);
    res.status(500).json({ msj: 'Error al cambiar el status' });
  }
}

///////////////////////////////////////
// Funciones para WebSockets
///////////////////////////////////////

async function addProductFromSocket(productData) {
  try {
    const { title, stock, description, category, price, status } = productData;

    if (!title || stock == null || !description || !category || price == null) {
      throw new Error('Faltan campos obligatorios');
    }

    const newProduct = new Product({
      title,
      stock,
      description,
      category,
      price,
      status: status !== undefined ? status : true
    });

    await newProduct.save();
    return newProduct;
  } catch (err) {
    console.error('Error al guardar producto vía socket:', err);
    throw err;
  }
}

async function updateProductFromSocket(updatedProduct) {
  try {
    const { id, ...updateData } = updatedProduct;
    
    if ('id' in updateData) delete updateData.id;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  } catch (err) {
    console.error('Error al actualizar producto vía socket:', err);
    throw err;
  }
}

async function deleteProductFromSocket(id) {
  try {
    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) {
      throw new Error('Producto no encontrado');
    }
    
    return deleted;
  } catch (err) {
    console.error('Error al eliminar producto vía socket:', err);
    throw err;
  }
}

///////////////////////////////////////
// Exportar funciones
///////////////////////////////////////

module.exports = {
  listProducts,
  listProductsRender, // exporta esta para usar en la vista
  showProduct,
  showProductRender, // exporta esta para renderizado
  addProducto,
  refreshProduct,
  deletedProduct,
  changeStatusProduct,
  // Funciones para WebSockets
  addProductFromSocket,
  updateProductFromSocket,
  deleteProductFromSocket
};
