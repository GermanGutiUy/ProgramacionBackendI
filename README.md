# 🛒 Supermercado Online - E-commerce con Handlebars

Un sistema de e-commerce moderno y responsive desarrollado con Node.js, Express, MongoDB, Handlebars y Socket.io.

## ✨ Características Principales

### 🎨 **Diseño Moderno y Responsive**
- **Bootstrap 5** para un diseño responsive y moderno
- **FontAwesome** para iconos atractivos
- **Google Fonts (Poppins)** para tipografía elegante
- **Animaciones CSS** para una experiencia de usuario fluida
- **Gradientes y efectos visuales** modernos
- **Soporte para modo oscuro** automático

### 🔧 **Funcionalidades Completas**

#### 📦 **Gestión de Productos**
- ✅ Listado con paginación
- ✅ Filtros por categoría
- ✅ Ordenamiento por precio
- ✅ Búsqueda avanzada
- ✅ Agregar productos
- ✅ Editar productos
- ✅ Eliminar productos
- ✅ Cambiar estado (disponible/no disponible)

#### 🛒 **Gestión de Carritos**
- ✅ Crear carritos vacíos
- ✅ Agregar productos al carrito
- ✅ Actualizar cantidades
- ✅ Eliminar productos del carrito
- ✅ Vaciar carrito completo
- ✅ Eliminar carrito
- ✅ Ver detalles del carrito con totales

#### ⚡ **Tiempo Real con WebSockets**
- ✅ Actualización en tiempo real de productos
- ✅ Estadísticas dinámicas
- ✅ Indicador de conexión
- ✅ Notificaciones push
- ✅ Gestión de errores en tiempo real

### 🚀 **Tecnologías Utilizadas**

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Motor de Plantillas**: Handlebars
- **Comunicación en Tiempo Real**: Socket.io
- **Frontend**: Bootstrap 5, CSS3, JavaScript ES6+
- **Iconos**: FontAwesome 6
- **Fuentes**: Google Fonts (Poppins)

## 📁 Estructura del Proyecto

```
backend/
├── controllers/
│   ├── controllersProducts.js    # Lógica de productos
│   └── controllersCarts.js       # Lógica de carritos
├── models/
│   ├── product.js               # Modelo de productos
│   └── Cart.js                  # Modelo de carritos
├── views/
│   ├── layouts/
│   │   └── main.handlebars      # Layout principal
│   ├── home.handlebars          # Vista de productos
│   ├── products.handlebars      # Vista de carritos
│   └── realTimeProducts.handlebars # Vista tiempo real
├── public/
│   ├── css/
│   │   └── styles.css           # Estilos personalizados
│   └── js/
│       └── realtime.js          # JavaScript tiempo real
├── datos/
│   ├── products.json            # Datos de productos
│   └── cart.json                # Datos de carritos
├── app.js                       # Configuración principal
├── rutas.js                     # Definición de rutas
└── package.json                 # Dependencias
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o Atlas)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Editar la URL de MongoDB en `app.js`
   - O configurar variables de entorno

4. **Cargar datos iniciales**
   ```bash
   # Los datos se cargan automáticamente desde la carpeta datos/
   ```

5. **Ejecutar el servidor**
   ```bash
   npm start
   ```

6. **Acceder a la aplicación**
   - Abrir http://localhost:8080 en el navegador

## 🎯 Funcionalidades Detalladas

### 📱 **Responsive Design**
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: Adaptable a tablets y desktop
- **Touch Friendly**: Botones y elementos táctiles optimizados

### 🎨 **UI/UX Mejorada**
- **Cards Modernas**: Diseño de tarjetas con efectos hover
- **Gradientes**: Fondos y elementos con gradientes modernos
- **Animaciones**: Transiciones suaves y efectos visuales
- **Notificaciones**: Sistema de alertas elegante
- **Loading States**: Indicadores de carga atractivos

### 🔄 **Tiempo Real**
- **WebSocket Connection**: Conexión persistente con el servidor
- **Live Updates**: Actualización automática de datos
- **Connection Status**: Indicador visual del estado de conexión
- **Error Handling**: Manejo robusto de errores

### 📊 **Gestión de Datos**
- **Paginación**: Navegación eficiente entre páginas
- **Filtros**: Búsqueda y filtrado avanzado
- **Sorting**: Ordenamiento por diferentes criterios
- **CRUD Completo**: Operaciones Create, Read, Update, Delete

## 🎨 Características de Diseño

### **Paleta de Colores**
- **Primario**: #2c3e50 (Azul oscuro)
- **Secundario**: #3498db (Azul claro)
- **Éxito**: #27ae60 (Verde)
- **Peligro**: #e74c3c (Rojo)
- **Advertencia**: #f39c12 (Naranja)

### **Tipografía**
- **Familia**: Poppins (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Jerarquía**: Títulos, subtítulos y texto bien definidos

### **Efectos Visuales**
- **Sombras**: Efectos de profundidad con box-shadow
- **Gradientes**: Fondos con gradientes modernos
- **Transiciones**: Animaciones suaves en hover
- **Backdrop Filter**: Efectos de desenfoque

## 🔧 API Endpoints

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `PATCH /api/products/:id/status/:status` - Cambiar estado

### Carritos
- `POST /api/carts` - Crear carrito
- `GET /api/carts/:cid` - Obtener carrito
- `POST /api/carts/:cid/products/:pid` - Agregar producto
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto
- `DELETE /api/carts/:cid/clear` - Vaciar carrito
- `DELETE /api/carts/:cid` - Eliminar carrito

## 🚀 Mejoras Implementadas

### **Antes vs Después**

#### **Antes:**
- Diseño básico con HTML simple
- Tablas estáticas sin estilos
- Formularios básicos
- Sin responsividad
- Funcionalidad limitada

#### **Después:**
- ✅ **Diseño moderno y responsive**
- ✅ **Interfaz de usuario atractiva**
- ✅ **Funcionalidades completas de CRUD**
- ✅ **Tiempo real con WebSockets**
- ✅ **Gestión completa de carritos**
- ✅ **Animaciones y efectos visuales**
- ✅ **Sistema de notificaciones**
- ✅ **Optimización para móviles**

## 📱 Compatibilidad

- ✅ **Chrome** (recomendado)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ✅ **Dispositivos móviles**
- ✅ **Tablets**

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Germán Gutiérrez Rial**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Bootstrap por el framework CSS
- FontAwesome por los iconos
- Socket.io por la funcionalidad en tiempo real
- MongoDB por la base de datos
- La comunidad de Node.js

---

**¡Disfruta usando tu Supermercado Online! 🛒✨** 