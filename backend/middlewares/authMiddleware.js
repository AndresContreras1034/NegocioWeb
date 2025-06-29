const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware to verify the token and load the full user data
async function verificarToken(req, res, next) {
  const token = req.cookies.token;

  // If there's no token, redirect to the login page
  if (!token) {
    return res.redirect('/login');
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load the full user data from the database using the ID from the token
    const usuario = await Usuario.findById(decoded.id).lean();
    if (!usuario) {
      // If user not found, clear the token and redirect to login
      res.clearCookie('token');
      return res.redirect('/login');
    }

    // Attach the user data to the request object for later use
    req.usuario = usuario;
    next();
  } catch (error) {
    // If the token is invalid, clear the cookie and redirect to login
    console.error('Invalid token:', error);
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

// Middleware to allow only users with 'admin' role
function soloAdmin(req, res, next) {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next(); // Allow the request to proceed
  }
  // Deny access if user is not an admin
  return res.status(403).send('Access denied: admin only');
}

module.exports = {
  verificarToken,
  soloAdmin
};
