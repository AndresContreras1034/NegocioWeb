const mongoose = require('mongoose');

// Define the schema for a product
const productoSchema = new mongoose.Schema({
  nombre: { 
    type: String,        // Name of the product
    required: true       // This field is required
  },
  descripcion: { 
    type: String         // Optional description of the product
  },
  precio: { 
    type: Number,        // Price of the product
    required: true       // This field is required
  },
  imagen: { 
    type: String         // Image filename or URL
  },
  creadoPor: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the product
    ref: 'Usuario'                        // Links to the 'Usuario' collection
  },
  categoria: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the category
    ref: 'Categoria'                      // Links to the 'Categoria' collection
  },
  creadoEn: { 
    type: Date,          // Creation date
    default: Date.now    // Defaults to the current date and time
  }
});

// Export the model based on the schema
module.exports = mongoose.model('Producto', productoSchema);

