const socket = io();

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');
const connectionStatus = document.getElementById('connectionStatus');
const connectionProgress = document.getElementById('connectionProgress');
const totalProducts = document.getElementById('totalProducts');
const availableProducts = document.getElementById('availableProducts');
const unavailableProducts = document.getElementById('unavailableProducts');

// Connection status management
function updateConnectionStatus(connected) {
  const statusIcon = connectionStatus.querySelector('i');
  const statusText = connectionStatus.querySelector('span');
  const progressBar = connectionProgress;
  
  if (connected) {
    statusIcon.className = 'fas fa-circle text-success';
    statusText.textContent = 'Conectado';
    progressBar.className = 'progress-bar bg-success';
    progressBar.style.width = '100%';
  } else {
    statusIcon.className = 'fas fa-circle text-danger';
    statusText.textContent = 'Desconectado';
    progressBar.className = 'progress-bar bg-danger';
    progressBar.style.width = '0%';
  }
}

// Update statistics
function updateStatistics(products) {
  const total = products.length;
  const available = products.filter(p => p.status).length;
  const unavailable = total - available;
  
  totalProducts.textContent = total;
  availableProducts.textContent = available;
  unavailableProducts.textContent = unavailable;
}

// Create product card HTML
function createProductCard(product) {
  return `
    <div class="col">
      <div class="card product-card h-100" data-product-id="${product._id}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${product.title}</h5>
            <span class="status-badge ${product.status ? 'status-available' : 'status-unavailable'}">
              ${product.status ? 'Disponible' : 'No disponible'}
            </span>
          </div>
          
          <p class="card-text text-muted mb-3">${product.description}</p>
          
          <div class="mb-3">
            <span class="price-tag">$${product.price}</span>
            <span class="stock-info ms-2">
              <i class="fas fa-boxes me-1"></i>${product.stock} unidades
            </span>
          </div>
          
          <div class="mb-3">
            <span class="badge bg-secondary">${product.category}</span>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-warning flex-fill" 
                    onclick="editProduct('${product._id}')">
              <i class="fas fa-edit me-1"></i>Editar
            </button>
            <button class="btn btn-sm btn-outline-danger" 
                    onclick="deleteProduct('${product._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render products
const renderProducts = async () => {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    
    if (data.status === 'success' && data.payload) {
      const products = data.payload;
      
      if (products.length === 0) {
        productsContainer.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">No hay productos disponibles</h4>
            <p class="text-muted">Agrega tu primer producto usando el botón de arriba</p>
          </div>
        `;
      } else {
        const productsHTML = products.map(createProductCard).join('');
        productsContainer.innerHTML = `
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            ${productsHTML}
          </div>
        `;
      }
      
      updateStatistics(products);
    } else {
      throw new Error('Error en la respuesta del servidor');
    }
  } catch (err) {
    console.error('Error al obtener productos:', err);
    productsContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
        <h4 class="text-danger">Error al cargar productos</h4>
        <p class="text-muted">Intenta recargar la página</p>
      </div>
    `;
  }
};

// Show notification
function showNotification(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// Socket event handlers
socket.on('connect', () => {
  console.log('🟢 Conectado al servidor');
  updateConnectionStatus(true);
});

socket.on('disconnect', () => {
  console.log('🔴 Desconectado del servidor');
  updateConnectionStatus(false);
});

socket.on('update-products', () => {
  console.log('🔄 Actualizando productos...');
  renderProducts();
});

socket.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
  showNotification(`Error: ${error.msg}`, 'danger');
});

// Form handlers
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(addProductForm);
  const productData = Object.fromEntries(formData.entries());
  
  // Convert values
  productData.price = parseFloat(productData.price);
  productData.stock = parseInt(productData.stock);
  productData.status = productData.status === 'true';
  
  try {
    socket.emit('new-product', productData);
    addProductForm.reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    
    showNotification('Producto agregado exitosamente');
  } catch (error) {
    console.error('Error al agregar producto:', error);
    showNotification('Error al agregar producto', 'danger');
  }
});

deleteProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(deleteProductForm);
  const productId = formData.get('id');
  
  if (!productId) {
    showNotification('Por favor ingresa el ID del producto', 'warning');
    return;
  }
  
  try {
    socket.emit('delete-product', productId);
    deleteProductForm.reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
    modal.hide();
    
    showNotification('Producto eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    showNotification('Error al eliminar producto', 'danger');
  }
});

// Global functions for buttons
window.editProduct = function(productId) {
  showNotification('Función de edición en desarrollo', 'info');
};

window.deleteProduct = function(productId) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    socket.emit('delete-product', productId);
    showNotification('Producto eliminado exitosamente');
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
