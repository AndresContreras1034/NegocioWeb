const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const Producto = require('../models/Producto');

// DISPLAY CART
router.get('/', verificarToken, (req, res) => {
  const carrito = req.session.carrito || []; // Retrieve cart from session or set empty array
  res.render('carrito/index', {
    titulo: 'Your Cart',
    carrito
  });
});

// ADD PRODUCT TO CART
router.post('/agregar/:id', verificarToken, async (req, res) => {
  try {
    // Find the product by ID
    const producto = await Producto.findById(req.params.id).lean();
    if (!producto) return res.redirect('/productos'); // If not found, redirect to products

    // Initialize cart in session if it doesn't exist
    if (!req.session.carrito) req.session.carrito = [];

    // Check if the product is already in the cart
    const index = req.session.carrito.findIndex(p => p._id == producto._id);
    if (index >= 0) {
      // If found, increase quantity
      req.session.carrito[index].cantidad += 1;
    } else {
      // If not found, add it to the cart
      req.session.carrito.push({
        _id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }

    res.redirect('/carrito'); // Redirect to the cart view
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.redirect('/productos'); // Redirect on error
  }
});

// REMOVE PRODUCT FROM CART
router.post('/eliminar/:id', verificarToken, (req, res) => {
  if (!req.session.carrito) req.session.carrito = [];

  // Filter out the product to remove it
  req.session.carrito = req.session.carrito.filter(p => p._id !== req.params.id);

  res.redirect('/carrito'); // Redirect back to the cart
});

module.exports = router;
