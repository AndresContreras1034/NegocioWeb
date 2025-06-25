const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Listar usuarios
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  const usuarios = await Usuario.find().lean();
  res.render('usuarios/lista', { titulo: 'Gestión de Usuarios', usuarios });
});

// Formulario para editar rol
router.get('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).lean();
  if (!usuario) return res.redirect('/usuarios');
  res.render('usuarios/editar', { titulo: 'Editar Usuario', usuario });
});

// Procesar edición
router.post('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const { rol } = req.body;
  try {
    await Usuario.findByIdAndUpdate(req.params.id, { rol });
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error al editar usuario:', error);
    res.redirect('/usuarios');
  }
});

// Eliminar usuario
router.post('/eliminar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.redirect('/usuarios');
  }
});

module.exports = router;
