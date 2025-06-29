const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// LIST ALL USERS (ADMIN ONLY)
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  const usuarios = await Usuario.find().lean(); // Get all users
  res.render('usuarios/lista', { 
    titulo: 'User Management', 
    usuarios 
  });
});

// SHOW FORM TO EDIT USER ROLE (ADMIN ONLY)
router.get('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).lean(); // Find user by ID
  if (!usuario) return res.redirect('/usuarios'); // If not found, redirect

  res.render('usuarios/editar', { 
    titulo: 'Edit User', 
    usuario 
  });
});

// PROCESS USER ROLE EDIT (ADMIN ONLY)
router.post('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const { rol } = req.body; // Get new role from form

  try {
    await Usuario.findByIdAndUpdate(req.params.id, { rol }); // Update user role
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error editing user:', error);
    res.redirect('/usuarios');
  }
});

// DELETE USER (ADMIN ONLY)
router.post('/eliminar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id); // Delete user by ID
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.redirect('/usuarios');
  }
});

module.exports = router;
