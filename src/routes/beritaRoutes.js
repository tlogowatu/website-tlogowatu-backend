const express = require('express');
const router = express.Router();

// Impor semua fungsi handler dari controller
const {
  createBeritaHandler,
  getAllBeritaHandler,
  getCarouselBeritaHandler,
  getBeritaBySlugHandler,
  deleteBeritaHandler
} = require('../controllers/beritaController');

// Impor middleware untuk upload gambar
const upload = require('../middleware/uploadMiddleware');


// Rute untuk membuat berita baru (membutuhkan upload gambar)
// POST /api/berita
router.post('/', upload.single('gambar'), createBeritaHandler);

// Rute untuk mengambil semua berita dalam format list
// GET /api/berita
router.get('/', getAllBeritaHandler);

// Rute untuk mengambil 5 berita terbaru untuk carousel
// GET /api/berita/carousel
router.get('/carousel', getCarouselBeritaHandler); 

// Rute untuk mengambil detail satu berita berdasarkan slug
// GET /api/berita/:slug
router.get('/:slug', getBeritaBySlugHandler);

// Rute untuk menghapus satu berita berdasarkan slug
// DELETE /api/berita/:slug
router.delete('/:slug', deleteBeritaHandler);


module.exports = router;