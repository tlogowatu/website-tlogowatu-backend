// src/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllDataHandler,
  updateDataHandler
} = require('../controllers/dataControllers');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllDataHandler);
router.put('/:id', protect, updateDataHandler);

module.exports = router;