const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
