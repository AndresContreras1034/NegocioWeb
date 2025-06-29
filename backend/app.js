const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();

// 🔧 Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 📁 Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 📦 Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🍪 Parse cookies for authentication
app.use(cookieParser());

// 🔐 Session middleware (REQUIRED for cart functionality)
app.use(session({
  secret: 'mi_clave_secreta', // You should replace this with an environment variable
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// 🌐 Global middleware to make user info available in views
app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.usuario = decoded; // Available in all EJS views
    } catch (err) {
      res.locals.usuario = null;
    }
  } else {
    res.locals.usuario = null;
  }

  next();
});

// 📚 Import and use all route modules
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const usuariosRoutes = require('./routes/usuarios');
const panelAdminRoutes = require('./routes/panel/admin');
const carritoRoutes = require('./routes/carrito');

// 📌 Define base paths for routes
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/productos', productosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/panel', panelAdminRoutes);
app.use('/carrito', carritoRoutes);

module.exports = app;
