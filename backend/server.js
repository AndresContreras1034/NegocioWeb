// Cargar variables de entorno desde .env (con ruta explícita)
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// Mostrar valor de MONGO_URI para depuración
console.log("🔍 MONGO_URI cargado:", process.env.MONGO_URI);

// Dependencias
const mongoose = require('mongoose');
const app = require('./app');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Error al conectar a MongoDB:', err);
});
