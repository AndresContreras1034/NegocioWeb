const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// LIST ALL CATEGORIES
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const categorias = await Categoria.find().lean(); // Retrieve all categories
    res.render('categorias/lista', {
      titulo: 'Categories',
      categorias
    });
  } catch (error) {
    console.error('Error listing categories:', error);
    res.redirect('/');
  }
});

// SHOW FORM TO CREATE NEW CATEGORY
router.get('/nueva', verificarToken, soloAdmin, (req, res) => {
  res.render('categorias/nueva', {
    titulo: 'New Category',
    error: null
  });
});

// CREATE NEW CATEGORY
router.post('/nueva', verificarToken, soloAdmin, async (req, res) => {
  const { nombre } = req.body;

  try {
    // Check if category already exists
    const existente = await Categoria.findOne({ nombre });
    if (existente) {
      return res.render('categorias/nueva', {
        titulo: 'New Category',
        error: 'Category already exists.'
      });
    }

    // Create and save the new category
    const categoria = new Categoria({ nombre });
    await categoria.save();
    res.redirect('/categorias');
  } catch (error) {
    console.error('Error creating category:', error);
    res.render('categorias/nueva', {
      titulo: 'New Category',
      error: 'Error creating the category.'
    });
  }
});

// SHOW FORM TO EDIT A CATEGORY
router.get('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id).lean(); // Find category by ID
    if (!categoria) return res.redirect('/categorias');

    res.render('categorias/editar', {
      titulo: 'Edit Category',
      categoria,
      error: null
    });
  } catch (error) {
    console.error('Error loading category:', error);
    res.redirect('/categorias');
  }
});

// PROCESS CATEGORY EDIT
router.post('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  const { nombre } = req.body;

  try {
    await Categoria.findByIdAndUpdate(req.params.id, { nombre }); // Update category name
    res.redirect('/categorias');
  } catch (error) {
    console.error('Error editing category:', error);
    res.redirect('/categorias');
  }
});

// DELETE CATEGORY
router.post('/eliminar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id); // Delete category by ID
    res.redirect('/categorias');
  } catch (error) {
    console.error('Error deleting category:', error);
    res.redirect('/categorias');
  }
});

module.exports = router;

