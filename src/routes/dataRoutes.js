// src/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllDataHandler,
  updateDataHandler
} = require('../controllers/dataControllers');

// GET /api/data
router.get('/', getAllDataHandler);
// PUT /api/data/tlogowatu
router.put('/:id', updateDataHandler);

module.exports = router;