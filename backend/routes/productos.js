const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria'); // ✅ Category model
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Multer for image upload

// DISPLAY ALL PRODUCTS (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('categoria') // Populate category reference
      .lean(); // Convert documents to plain JS objects

    res.render('productos/lista', {
      titulo: 'Products',
      productos
    });
  } catch (error) {
    console.error('Error listing products:', error);
    res.redirect('/');
  }
});

// FORM TO CREATE NEW PRODUCT (ADMIN ONLY)
router.get('/nuevo', verificarToken, soloAdmin, async (req, res) => {
  try {
    const categorias = await Categoria.find().lean(); // Get available categories
    res.render('productos/nuevo', {
      titulo: 'Add Product',
      categorias
    });
  } catch (error) {
    console.error('Error loading new product form:', error);
    res.redirect('/productos');
  }
});

// CREATE NEW PRODUCT WITH IMAGE (ADMIN ONLY)
router.post('/nuevo', verificarToken, soloAdmin, upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : ''; // Save image path if uploaded

  try {
    const nuevo = new Producto({
      nombre,
      descripcion,
      precio,
      imagen,
      categoria,
      creadoPor: req.usuario.id // Save the creator's user ID
    });

    await nuevo.save(); // Save product to DB
    res.redirect('/productos');
  } catch (error) {
    console.error('Error saving product:', error);
    res.redirect('/productos');
  }
});

// FORM TO EDIT PRODUCT (ADMIN ONLY)
router.get('/editar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).lean(); // Find product by ID
    const categorias = await Categoria.find().lean(); // Get categories for dropdown

    if (!producto) return res.redirect('/productos');

    res.render('productos/editar', {
      titulo: 'Edit Product',
      producto,
      categorias
    });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.redirect('/productos');
  }
});

// PROCESS PRODUCT EDIT (ADMIN ONLY)
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
    console.error('Error editing product:', error);
    res.redirect('/productos');
  }
});

// DELETE PRODUCT (ADMIN ONLY)
router.post('/eliminar/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id); // Delete by ID
    res.redirect('/productos');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.redirect('/productos');
  }
});

module.exports = router;


