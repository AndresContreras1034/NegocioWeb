const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const Producto = require('../models/Producto');

// Mostrar el carrito
router.get('/', verificarToken, (req, res) => {
  const carrito = req.session.carrito || [];
  res.render('carrito/index', {
    titulo: 'Tu Carrito',
    carrito
  });
});

// Agregar producto al carrito
router.post('/agregar/:id', verificarToken, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).lean();
    if (!producto) return res.redirect('/productos');

    if (!req.session.carrito) req.session.carrito = [];

    const index = req.session.carrito.findIndex(p => p._id == producto._id);
    if (index >= 0) {
      req.session.carrito[index].cantidad += 1;
    } else {
      req.session.carrito.push({
        _id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }

    res.redirect('/carrito');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.redirect('/productos');
  }
});

// Eliminar producto del carrito
router.post('/eliminar/:id', verificarToken, (req, res) => {
  if (!req.session.carrito) req.session.carrito = [];

  req.session.carrito = req.session.carrito.filter(p => p._id !== req.params.id);

  res.redirect('/carrito');
});

module.exports = router;
