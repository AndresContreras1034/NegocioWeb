const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');

const ExcelJS = require('exceljs');

// Ruta principal del panel de administración
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const totalUsuarios = await Usuario.countDocuments();
    const totalProductos = await Producto.countDocuments();
    const totalCategorias = await Categoria.countDocuments();
    const adminCount = await Usuario.countDocuments({ rol: 'admin' });
    const clienteCount = await Usuario.countDocuments({ rol: 'cliente' });

    const productos = await Producto.find().lean();
    const totalPrecio = productos.reduce((acc, p) => acc + p.precio, 0);
    const promedioPrecio = productos.length > 0 ? (totalPrecio / productos.length).toFixed(2) : 0;

    res.render('panel/admin', {
      titulo: 'Panel de Administración',
      totalUsuarios,
      totalProductos,
      totalCategorias,
      adminCount,
      clienteCount,
      promedioPrecio
    });
  } catch (error) {
    console.error('Error al cargar panel:', error);
    res.redirect('/');
  }
});

// Ruta para exportar estadísticas a Excel
router.get('/exportar/excel', verificarToken, soloAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().lean();
    const productos = await Producto.find().populate('categoria').lean();
    const categorias = await Categoria.find().lean();

    const workbook = new ExcelJS.Workbook();
    const hojaUsuarios = workbook.addWorksheet('Usuarios');
    const hojaProductos = workbook.addWorksheet('Productos');
    const hojaCategorias = workbook.addWorksheet('Categorías');

    // Usuarios
    hojaUsuarios.columns = [
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Correo', key: 'correo', width: 30 },
      { header: 'Rol', key: 'rol', width: 15 },
    ];
    hojaUsuarios.addRows(usuarios);

    // Productos
    hojaProductos.columns = [
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Precio', key: 'precio', width: 15 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
      { header: 'Categoría', key: 'categoria', width: 30 }
    ];
    productos.forEach(p => {
      hojaProductos.addRow({
        nombre: p.nombre,
        precio: p.precio,
        descripcion: p.descripcion,
        categoria: p.categoria ? p.categoria.nombre : 'Sin categoría'
      });
    });

    // Categorías
    hojaCategorias.columns = [
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
    ];
    hojaCategorias.addRows(categorias);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=estadisticas.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    res.redirect('/panel');
  }
});

module.exports = router;

