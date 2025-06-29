const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Producto = require('../models/Producto'); // Product model

// HOME PAGE
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Home - Business' });
});

// ABOUT US PAGE
router.get('/about', (req, res) => {
  res.render('about', { titulo: 'About Us' });
});

// SERVICES PAGE
router.get('/services', (req, res) => {
  res.render('services', { titulo: 'Services' });
});

// CONTACT FORM (GET)
router.get('/contact', (req, res) => {
  res.render('contact', {
    titulo: 'Contact Us',
    mensaje: null
  });
});

// CONTACT FORM (POST) - Send email
router.post('/contact', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  try {
    // Configure the email transport using Gmail and credentials from .env
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app-specific password
      }
    });

    // Set up the email content
    const mailOptions = {
      from: email, // Sender's email
      to: process.env.EMAIL_USER, // Your email to receive the message
      subject: `New message from ${nombre}`,
      text: `Email: ${email}\n\nMessage:\n${mensaje}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Render contact page with success message
    res.render('contact', {
      titulo: 'Contact Us',
      mensaje: 'Message sent successfully.'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.render('contact', {
      titulo: 'Contact Us',
      mensaje: 'An error occurred while sending the message.'
    });
  }
});

// PRODUCT CATALOG (GET)
router.get('/productos', async (req, res) => {
  try {
    // Retrieve all products and populate category reference
    const productos = await Producto.find().populate('categoria').lean();
    res.render('productos/index', {
      titulo: 'Product Catalog',
      productos
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.redirect('/');
  }
});

// PRODUCT DETAIL BY ID (GET)
router.get('/productos/:id', async (req, res) => {
  try {
    // Find product by ID and populate its category
    const producto = await Producto.findById(req.params.id)
      .populate('categoria')
      .lean();

    if (!producto) return res.redirect('/productos');

    res.render('productos/detalle', {
      titulo: `Product - ${producto.nombre}`,
      producto
    });
  } catch (error) {
    console.error('Error loading product detail:', error);
    res.redirect('/productos');
  }
});

module.exports = router;


module.exports = router;

