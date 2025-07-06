const socket = io(); // se conecta al servidor

const productList = document.getElementById('product-list');
const addForm = document.getElementById('add-form');
const deleteForm = document.getElementById('delete-form');

// Función que actualiza la lista de productos consultando al backend
const renderProducts = async () => {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    productList.innerHTML = '';
    products.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} - $${p.price}`;
      productList.appendChild(li);
    });
  } catch (err) {
    console.error('Error al obtener productos:', err);
  }
};

// Ejecutar al cargar la vista
renderProducts();

// Escuchar evento para volver a renderizar productos cuando se agregue o borre uno
socket.on('update-products', renderProducts);

// Enviar nuevo producto al servidor vía socket
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const product = Object.fromEntries(formData.entries());

  product.price = parseFloat(product.price);
  product.stock = parseInt(product.stock);

  socket.emit('new-product', product);
  addForm.reset();
});

// Enviar ID de producto a eliminar vía socket
deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = parseInt(new FormData(deleteForm).get('id'));
  socket.emit('delete-product', id);
  deleteForm.reset();
});
