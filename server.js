const express = require('express');
const cors = require('cors');
require('dotenv').config();

const beritaRoutes = require('./src/routes/beritaRoutes');
const dataRoutes = require('./src/routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Mengizinkan akses dari mana saja
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/berita', beritaRoutes);
app.use('/api/data', dataRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
});