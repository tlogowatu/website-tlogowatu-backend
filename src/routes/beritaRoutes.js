const express = require('express');
const router = express.Router();

const {
  createBeritaHandler,
  getAllBeritaHandler,
  getCarouselBeritaHandler,
  getBeritaBySlugHandler,
  deleteBeritaHandler
} = require('../controllers/beritaController');

const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('gambar'), createBeritaHandler);
router.get('/', getAllBeritaHandler);
router.get('/carousel', getCarouselBeritaHandler); 
router.get('/:slug', getBeritaBySlugHandler);
router.delete('/:slug', protect, deleteBeritaHandler);


module.exports = router;