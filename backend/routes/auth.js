const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { verificarToken } = require('../middlewares/authMiddleware');

// FORMULARIO DE REGISTRO
router.get('/register', (req, res) => {
  res.render('register', { titulo: 'Registro', error: null });
});

// PROCESAR REGISTRO
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.render('register', { titulo: 'Registro', error: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ nombre, correo, contraseña: hash });
    await nuevoUsuario.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error en el registro:', error);
    res.render('register', { titulo: 'Registro', error: 'Error en el registro.' });
  }
});

// FORMULARIO DE LOGIN
router.get('/login', (req, res) => {
  res.render('login', { titulo: 'Iniciar Sesión', error: null });
});

// PROCESAR LOGIN
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.render('login', { titulo: 'Iniciar Sesión', error: 'Correo no registrado.' });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.render('login', { titulo: 'Iniciar Sesión', error: 'Contraseña incorrecta.' });
    }

    // Incluye nombre y rol en el token para poder usarlo en el header
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/panel');
  } catch (error) {
    console.error('Error en login:', error);
    res.render('login', { titulo: 'Iniciar Sesión', error: 'Error al iniciar sesión.' });
  }
});

// PANEL DE USUARIO (PROTEGIDO)
router.get('/panel', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).lean();
    if (!usuario) return res.redirect('/login');

    res.render('panel', {
      titulo: 'Panel de Usuario',
      usuario
    });
  } catch (error) {
    console.error('Error al cargar el panel:', error);
    res.redirect('/login');
  }
});

// CERRAR SESIÓN
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;


