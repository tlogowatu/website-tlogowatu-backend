const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginHandler = (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek kredensial dengan yang ada di .env
    const isValid = 
      username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD;

    if (!isValid) {
      const error = new Error("Username atau password salah");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // Jika valid, buat token JWT
    const token = jwt.sign(
      { id: 'admin', username: username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Token berlaku selama 8 jam
    );

    res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: { token }
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal memproses login"
    });
  }
};

module.exports = { loginHandler };