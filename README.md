# 🛍️ NegocioWeb

**NegocioWeb** es una aplicación web desarrollada con Node.js, Express y MongoDB que simula una tienda en línea con funcionalidades de autenticación, gestión de productos, usuarios y categorías, incluyendo roles de usuario (admin/cliente) y un carrito de compras.

---

## 🚀 Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Panel de administración (solo para usuarios con rol `admin`)
- Gestión de productos (crear, editar, eliminar)
- Gestión de categorías
- Gestión de usuarios y roles
- Carrito de compras por sesión
- Carga de imágenes para productos
- Seguridad con JWT y middleware de roles

---

## 🛠️ Tecnologías usadas

- Node.js + Express
- MongoDB + Mongoose
- EJS (plantillas)
- Bootstrap 5 + Icons
- JWT (autenticación)
- Multer (carga de archivos)
- Chart.js (gráficas)
- Dotenv

---

## 📦 Instalación local

1. Clona el repositorio:

```bash
git clone https://github.com/AndresContreras1034/NegocioWeb.git
cd NegocioWeb


Instala las dependencias:

bash
Copiar
Editar
npm install
Crea un archivo .env en la raíz con esta estructura:

env
Copiar
Editar
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=clave_secreta
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
Inicia el servidor:

bash
Copiar
Editar
npm run dev
La app estará disponible en: http://localhost:3000

🧑‍💻 Estructura de carpetas
pgsql
Copiar
Editar
NegocioWeb/
├── models/
├── views/
│   ├── partials/
│   ├── productos/
│   └── panel/
├── public/
├── routes/
├── middlewares/
├── .env
├── app.js
└── server.js
🔒 Roles de usuario
Admin: Puede acceder al panel, gestionar productos, categorías y usuarios.

Cliente: Solo puede navegar, ver productos y añadir al carrito.

✨ Créditos
Desarrollado por Andrés Contreras — Proyecto académico de práctica con enfoque fullstack.

