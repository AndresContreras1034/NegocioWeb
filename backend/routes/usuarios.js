const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// LIST ALL USERS (ADMIN ONLY)
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    // Fetch all users from the database
    const usuarios = await Usuario.find().lean();

    // Render the user list view
    res.render('usuarios/lista', {
      titulo: 'User Management',
      usuarios
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.redirect('/');
  }
});

// SHOW EDIT FORM FOR A USER (ADMIN ONLY)
router.get('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    // Find the user by ID
    const usuario = await Usuario.findById(req.params.id).lean();

    // If user does not exist, redirect to user list
    if (!usuario) return res.redirect('/usuarios');

    // Render the edit form with the user's data
    res.render('usuarios/editar', {
      titulo: 'Edit User',
      usuario
    });
  } catch (error) {
    console.error('Error loading user:', error);
    res.redirect('/usuarios');
  }
});

// PROCESS EDIT USER (ADMIN ONLY)
router.post('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, correo, rol } = req.body;

  try {
    // Update the user's information
    await Usuario.findByIdAndUpdate(req.params.id, {
      nombre,
      correo,
      rol
    });

    // Redirect to the user list after successful update
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error updating user:', error);
    res.redirect('/usuarios');
  }
});

// DELETE USER (ADMIN ONLY)
router.post('/eliminar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    // Delete user by ID
    await Usuario.findByIdAndDelete(req.params.id);
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.redirect('/usuarios');
  }
});

module.exports = router;
