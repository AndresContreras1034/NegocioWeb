const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Producto = require('../models/Producto'); // Modelo de productos

// Página de inicio
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Inicio - Negocio' });
});

// Nosotros
router.get('/about', (req, res) => {
  res.render('about', { titulo: 'Sobre Nosotros' });
});

// Servicios
router.get('/services', (req, res) => {
  res.render('services', { titulo: 'Servicios' });
});

// Contacto (GET)
router.get('/contact', (req, res) => {
  res.render('contact', {
    titulo: 'Contáctanos',
    mensaje: null
  });
});

// Contacto (POST)
router.post('/contact', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Correo: ${email}\n\nMensaje:\n${mensaje}`
    };

    await transporter.sendMail(mailOptions);

    res.render('contact', {
      titulo: 'Contáctanos',
      mensaje: 'Mensaje enviado exitosamente.'
    });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.render('contact', {
      titulo: 'Contáctanos',
      mensaje: 'Ocurrió un error al enviar el mensaje.'
    });
  }
});

// Catálogo de productos (GET)
router.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria').lean();
    res.render('productos/index', {
      titulo: 'Catálogo de Productos',
      productos
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.redirect('/');
  }
});

// Detalle de producto por ID (GET)
router.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoria')
      .lean();

    if (!producto) return res.redirect('/productos');

    res.render('productos/detalle', {
      titulo: `Producto - ${producto.nombre}`,
      producto
    });
  } catch (error) {
    console.error('Error al cargar detalle del producto:', error);
    res.redirect('/productos');
  }
});

module.exports = router;

