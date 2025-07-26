const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  status: { type: Boolean, default: true } // si usas status en el controlador
});

// Evitar error OverwriteModelError al verificar si ya existe el modelo:
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
