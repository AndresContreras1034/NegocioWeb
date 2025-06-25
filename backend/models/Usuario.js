const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  contraseña: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  rol: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente'
  }
}, {
  timestamps: true // Opcional: guarda createdAt y updatedAt
});

module.exports = mongoose.model('Usuario', usuarioSchema);
