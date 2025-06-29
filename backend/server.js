// 🌱 Load environment variables from .env (with explicit path)
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// 🔍 Log MONGO_URI for debugging purposes
console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI);

// 📦 Dependencies
const mongoose = require('mongoose');
const app = require('./app'); // Express app

// 🔗 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');

  // Start the server once the database is ready
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
