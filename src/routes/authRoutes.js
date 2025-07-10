const express = require('express');
const router = express.Router();
const { loginHandler } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', loginHandler);

module.exports = router;