function soloAdmin(req, res, next) {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso denegado: solo administradores');
}

module.exports = soloAdmin;
