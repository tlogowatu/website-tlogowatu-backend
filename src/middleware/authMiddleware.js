const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Ambil token dari header (setelah 'Bearer ')
      token = authHeader.split(' ')[1];
      
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Anda bisa menambahkan data user ke request jika perlu
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ status: "error", message: "Token tidak valid atau kedaluwarsa" });
    }
  }

  if (!token) {
    res.status(401).json({ status: "error", message: "Tidak ada token, akses ditolak" });
  }
};

module.exports = { protect };