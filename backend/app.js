const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares generales
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// 🔐 Middleware de sesión (REQUIRED para el carrito)
app.use(session({
  secret: 'mi_clave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Middleware global para usuario
app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.usuario = decoded;
    } catch (err) {
      res.locals.usuario = null;
    }
  } else {
    res.locals.usuario = null;
  }

  next();
});

// Rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const usuariosRoutes = require('./routes/usuarios');
const panelAdminRoutes = require('./routes/panel/admin');
const carritoRoutes = require('./routes/carrito');

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/productos', productosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/panel', panelAdminRoutes);
app.use('/carrito', carritoRoutes);

module.exports = app;

