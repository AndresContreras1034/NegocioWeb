const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Listar todas las categorías
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const categorias = await Categoria.find().lean();
    res.render('categorias/lista', {
      titulo: 'Categorías',
      categorias
    });
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.redirect('/');
  }
});

// Mostrar formulario para crear nueva categoría
router.get('/nueva', verificarToken, soloAdmin, (req, res) => {
  res.render('categorias/nueva', {
    titulo: 'Nueva Categoría',
    error: null
  });
});

// Crear nueva categoría
router.post('/nueva', verificarToken, soloAdmin, async (req, res) => {
  const { nombre } = req.body;

  try {
    const existente = await Categoria.findOne({ nombre });
    if (existente) {
      return res.render('categorias/nueva', {
        titulo: 'Nueva Categoría',
        error: 'La categoría ya existe.'
      });
    }

    const categoria = new Categoria({ nombre });
    await categoria.save();
    res.redirect('/categorias');
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.render('categorias/nueva', {
      titulo: 'Nueva Categoría',
      error: 'Error al crear la categoría.'
    });
  }
});

// Formulario para editar categoría
router.get('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id).lean();
    if (!categoria) return res.redirect('/categorias');

    res.render('categorias/editar', {
      titulo: 'Editar Categoría',
      categoria,
      error: null
    });
  } catch (error) {
    console.error('Error al cargar categoría:', error);
    res.redirect('/categorias');
  }
});

// Procesar edición de categoría
router.post('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const { nombre } = req.body;

  try {
    await Categoria.findByIdAndUpdate(req.params.id, { nombre });
    res.redirect('/categorias');
  } catch (error) {
    console.error('Error al editar categoría:', error);
    res.redirect('/categorias');
  }
});

// Eliminar categoría
router.post('/eliminar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.redirect('/categorias');
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.redirect('/categorias');
  }
});

module.exports = router;

