const mongoose = require('mongoose');

// Define the schema for a user
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,                           // User's name
    required: [true, 'Name is required'],   // Field is required with custom error message
    trim: true                              // Removes leading/trailing whitespace
  },
  correo: {
    type: String,                             // User's email
    required: [true, 'Email is required'],    // Field is required with custom error message
    unique: true,                             // Must be unique in the collection
    lowercase: true,                          // Converts the value to lowercase
    trim: true                                // Removes leading/trailing whitespace
  },
  contraseña: {
    type: String,                                // User's password (should be hashed)
    required: [true, 'Password is required']     // Field is required with custom error message
  },
  rol: {
    type: String,                             // Role of the user
    enum: ['admin', 'cliente'],               // Can only be 'admin' or 'cliente'
    default: 'cliente'                        // Default value if none is provided
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Export the model based on the schema
module.exports = mongoose.model('Usuario', usuarioSchema);
