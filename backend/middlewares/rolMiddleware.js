// Middleware to allow access only to users with the 'admin' role
function soloAdmin(req, res, next) {
  // Check if the user is logged in and has the 'admin' role
  if (req.usuario && req.usuario.rol === 'admin') {
    return next(); // User is admin, allow the request to proceed
  }

  // If not admin, respond with 403 Forbidden status
  return res.status(403).send('Access denied: admin only');
}

module.exports = soloAdmin;
