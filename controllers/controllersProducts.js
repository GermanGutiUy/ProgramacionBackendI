const Product = require('../datos/products');

///////////////////////////////////////
// Listar productos con paginación, filtros y orden
///////////////////////////////////////
async function listProducts(req, res) {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const filter = {};
    if (query) {
      // Buscar por categoría (type) o por disponibilidad (status)
      if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
        filter.status = query.toLowerCase() === 'true';
      } else {
        filter.type = query;
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
      .limit(limit);

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const baseUrl = req.baseUrl + req.path;

    // Construir links con query params para paginación
    const queryString = [];
    if (limit) queryString.push(`limit=${limit}`);
    if (sort) queryString.push(`sort=${sort}`);
    if (query) queryString.push(`query=${query}`);

    const baseLink = `${baseUrl}?${queryString.join('&')}`;

    const prevLink = hasPrevPage ? `${baseLink}&page=${page - 1}` : null;
    const nextLink = hasNextPage ? `${baseLink}&page=${page + 1}` : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error listando productos' });
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
    console.error(err);
    res.status(500).json({ msj: 'Error obteniendo producto' });
  }
}

///////////////////////////////////////
// Crear nuevo producto
///////////////////////////////////////
async function addProducto(req, res) {
  try {
    const { name, stock, desc, type, price, status } = req.body;
    if (!name || stock == null || !desc || !type || price == null) {
      return res.status(400).json({ msj: 'Faltan campos obligatorios' });
    }
    const newProduct = new Product({
      name,
      stock,
      desc,
      type,
      price,
      status: status !== undefined ? status : true
    });
    await newProduct.save();
    res.status(201).json({ msj: 'Producto agregado', product: newProduct });
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ msj: 'Error al cambiar el status' });
  }
}

///////////////////////////////////////
// Exportar funciones
///////////////////////////////////////
module.exports = {
  listProducts,
  showProduct,
  addProducto,
  refreshProduct,
  deletedProduct,
  changeStatusProduct
};
