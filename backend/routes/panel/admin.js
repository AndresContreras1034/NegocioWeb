const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../../middlewares/authMiddleware');

const Usuario = require('../../models/Usuario');
const Producto = require('../../models/Producto');
const Categoria = require('../../models/Categoria');

router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const totalUsuarios = await Usuario.countDocuments();
    const totalProductos = await Producto.countDocuments();
    const totalCategorias = await Categoria.countDocuments();
    const adminCount = await Usuario.countDocuments({ rol: 'admin' });
    const clienteCount = await Usuario.countDocuments({ rol: 'cliente' });

    const productosRecientes = await Producto.find().sort({ precio: -1 }).limit(5).populate('categoria').lean();
    const usuariosRecientes = await Usuario.find().sort({ _id: -1 }).limit(5).lean();

    const productosPorCategoria = await Producto.aggregate([
      { $group: { _id: "$categoria", total: { $sum: 1 } } }
    ]);

    const categorias = await Categoria.find().lean();
    const categoriasMap = {};
    categorias.forEach(cat => {
      categoriasMap[cat._id.toString()] = cat.nombre;
    });

    const productosConCategoria = productosPorCategoria.map(pc => ({
      nombre: categoriasMap[pc._id?.toString()] || 'Sin categoría',
      total: pc.total
    }));

    const totalPrecio = productosRecientes.reduce((acc, p) => acc + p.precio, 0);
    const promedioPrecio = productosRecientes.length > 0
      ? (totalPrecio / productosRecientes.length).toFixed(2)
      : 0;

    res.render('panel/admin', {
      titulo: 'Panel de Administración',
      totalUsuarios,
      totalProductos,
      totalCategorias,
      adminCount,
      clienteCount,
      promedioPrecio,
      productosRecientes,
      usuariosRecientes,
      productosConCategoria
    });
  } catch (error) {
    console.error('Error al cargar panel:', error);
    res.redirect('/');
  }
});

module.exports = router;
