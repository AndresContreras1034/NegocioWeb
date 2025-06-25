const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria'); // ✅ modelo de categoría
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Mostrar todos los productos (público)
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('categoria')
      .lean();
    res.render('productos/lista', {
      titulo: 'Productos',
      productos
    });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.redirect('/');
  }
});

// Formulario para nuevo producto (solo admin)
router.get('/nuevo', verificarToken, soloAdmin, async (req, res) => {
  try {
    const categorias = await Categoria.find().lean();
    res.render('productos/nuevo', {
      titulo: 'Agregar Producto',
      categorias
    });
  } catch (error) {
    console.error('Error al cargar formulario nuevo producto:', error);
    res.redirect('/productos');
  }
});

// Crear nuevo producto con imagen (solo admin)
router.post('/nuevo', verificarToken, soloAdmin, upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const nuevo = new Producto({
      nombre,
      descripcion,
      precio,
      imagen,
      categoria,
      creadoPor: req.usuario.id
    });
    await nuevo.save();
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al guardar producto:', error);
    res.redirect('/productos');
  }
});

// Formulario de edición (solo admin)
router.get('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).lean();
    const categorias = await Categoria.find().lean();

    if (!producto) return res.redirect('/productos');

    res.render('productos/editar', {
      titulo: 'Editar Producto',
      producto,
      categorias
    });
  } catch (error) {
    console.error('Error al cargar formulario edición:', error);
    res.redirect('/productos');
  }
});

// Procesar edición (solo admin)
router.post('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, descripcion, precio, imagen, categoria } = req.body;

  try {
    await Producto.findByIdAndUpdate(req.params.id, {
      nombre,
      descripcion,
      precio,
      imagen,
      categoria
    });

    res.redirect('/productos');
  } catch (error) {
    console.error('Error al editar producto:', error);
    res.redirect('/productos');
  }
});

// Eliminar producto (solo admin)
router.post('/eliminar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.redirect('/productos');
  }
});

module.exports = router;

