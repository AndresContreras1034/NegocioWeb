const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');

const ExcelJS = require('exceljs');

// MAIN ADMIN PANEL ROUTE
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    // Count general statistics
    const totalUsuarios = await Usuario.countDocuments();
    const totalProductos = await Producto.countDocuments();
    const totalCategorias = await Categoria.countDocuments();
    const adminCount = await Usuario.countDocuments({ rol: 'admin' });
    const clienteCount = await Usuario.countDocuments({ rol: 'cliente' });

    // Calculate average product price
    const productos = await Producto.find().lean();
    const totalPrecio = productos.reduce((acc, p) => acc + p.precio, 0);
    const promedioPrecio = productos.length > 0 ? (totalPrecio / productos.length).toFixed(2) : 0;

    // Render admin dashboard
    res.render('panel/admin', {
      titulo: 'Admin Panel',
      totalUsuarios,
      totalProductos,
      totalCategorias,
      adminCount,
      clienteCount,
      promedioPrecio
    });
  } catch (error) {
    console.error('Error loading admin panel:', error);
    res.redirect('/');
  }
});

// EXPORT DATA TO EXCEL
router.get('/exportar/excel', verificarToken, soloAdmin, async (req, res) => {
  try {
    // Fetch all data from the database
    const usuarios = await Usuario.find().lean();
    const productos = await Producto.find().populate('categoria').lean();
    const categorias = await Categoria.find().lean();

    // Create a new Excel workbook and worksheets
    const workbook = new ExcelJS.Workbook();
    const hojaUsuarios = workbook.addWorksheet('Users');
    const hojaProductos = workbook.addWorksheet('Products');
    const hojaCategorias = workbook.addWorksheet('Categories');

    // USERS SHEET
    hojaUsuarios.columns = [
      { header: 'Name', key: 'nombre', width: 30 },
      { header: 'Email', key: 'correo', width: 30 },
      { header: 'Role', key: 'rol', width: 15 },
    ];
    hojaUsuarios.addRows(usuarios); // Add user data rows

    // PRODUCTS SHEET
    hojaProductos.columns = [
      { header: 'Name', key: 'nombre', width: 30 },
      { header: 'Price', key: 'precio', width: 15 },
      { header: 'Description', key: 'descripcion', width: 50 },
      { header: 'Category', key: 'categoria', width: 30 }
    ];
    productos.forEach(p => {
      hojaProductos.addRow({
        nombre: p.nombre,
        precio: p.precio,
        descripcion: p.descripcion,
        categoria: p.categoria ? p.categoria.nombre : 'Uncategorized'
      });
    });

    // CATEGORIES SHEET
    hojaCategorias.columns = [
      { header: 'Name', key: 'nombre', width: 30 },
      { header: 'Description', key: 'descripcion', width: 50 },
    ];
    hojaCategorias.addRows(categorias); // Add category data

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=statistics.xlsx');

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.redirect('/panel');
  }
});

module.exports = router;

module.exports = router;

