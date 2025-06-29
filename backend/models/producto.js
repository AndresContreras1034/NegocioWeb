const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imagen: { type: String },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }, 
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Producto', productoSchema);
