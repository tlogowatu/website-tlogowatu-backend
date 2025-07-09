const multer = require('multer');

// Konfigurasi multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Batas ukuran file 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
  }
});

module.exports = upload;