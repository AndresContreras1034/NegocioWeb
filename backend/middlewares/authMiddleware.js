const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para verificar el token y cargar el usuario completo
async function verificarToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cargar usuario completo desde la base de datos
    const usuario = await Usuario.findById(decoded.id).lean();
    if (!usuario) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Token inválido:', error);
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

// Middleware para permitir solo usuarios con rol admin
function soloAdmin(req, res, next) {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso denegado: solo administradores');
}

module.exports = {
  verificarToken,
  soloAdmin
};

