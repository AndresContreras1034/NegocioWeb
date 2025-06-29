const mongoose = require('mongoose');

// Define the schema for a category
const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,     // The name of the category must be a string
    required: true,   // This field is required (cannot be empty)
    unique: true      // Each category name must be unique in the collection
  }
});

// Export the model based on the schema
module.exports = mongoose.model('Categoria', categoriaSchema);
