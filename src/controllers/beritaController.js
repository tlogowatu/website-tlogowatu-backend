const { db } = require('../config/firebaseConfig');
const cloudinary = require('../config/cloudinaryConfig');

/**
 * Membuat Berita Baru
 */
const createBeritaHandler = async (req, res) => {
  try {
    // Nama penulis sekarang diinput dari body request
    const { judul, isi_berita, penulis, nama_dusun } = req.body;
    const file = req.file;

    // Validasi input
    if (!judul || !isi_berita || !penulis || !file) {
      const error = new Error("Field 'judul', 'isi_berita', 'penulis', dan 'gambar' harus diisi");
      error.statusCode = 400;
      throw error;
    }

    // Upload gambar ke Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "berita_desa" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const slug = `${judul.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const dataBerita = {
      judul,
      slug,
      isi_berita,
      penulis, // Menggunakan penulis dari input
      nama_dusun: nama_dusun || "Desa",
      url_gambar: uploadResult.secure_url,
      cloudinary_public_id: uploadResult.public_id,
      // Simpan objek Date lengkap untuk pengurutan yang akurat
      tanggal_publikasi: new Date(),
    };

    const docRef = await db.collection('berita').add(dataBerita);

    // Siapkan data respons dengan tanggal yang sudah diformat
    const responseData = {
      ...dataBerita,
      id: docRef.id,
      tanggal_publikasi: dataBerita.tanggal_publikasi.toISOString().slice(0, 10)
    };

    res.status(201).json({
      status: "success",
      message: "Berita berhasil dibuat",
      data: responseData
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk membuat berita baru",
    });
  }
};

/**
 * Mengambil Semua Berita (List)
 */
const getAllBeritaHandler = async (req, res) => {
  try {
    const snapshot = await db.collection('berita')
      .orderBy('tanggal_publikasi', 'desc')
      .select('judul', 'slug', 'url_gambar', 'penulis', 'tanggal_publikasi')
      .get();
      
    // Ubah format tanggal sebelum dikirim ke frontend
    const beritaList = snapshot.docs.map(doc => {
        const data = doc.data();
        // Firestore Timestamp perlu diubah ke JS Date dulu
        const tanggal = data.tanggal_publikasi.toDate().toISOString().slice(0, 10);
        return {
            id: doc.id,
            ...data,
            tanggal_publikasi: tanggal
        };
    });
    
    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan semua berita",
      data: beritaList
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Server gagal mendapatkan semua berita",
    });
  }
};

/**
 * Mengambil Detail Satu Berita berdasarkan Slug
 */
const getBeritaBySlugHandler = async (req, res) => {
    try {
        const { slug } = req.params;
        const snapshot = await db.collection('berita').where('slug', '==', slug).limit(1).get();

        if (snapshot.empty) {
            const error = new Error("Berita tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        const tanggal = data.tanggal_publikasi.toDate().toISOString().slice(0, 10);

        const beritaDetail = { 
            id: doc.id, 
            ...data,
            tanggal_publikasi: tanggal
        };

        res.status(200).json({
            status: "success",
            message: "Berhasil mendapatkan detail berita",
            data: beritaDetail
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Server gagal mendapatkan detail berita",
        });
    }
};

/**
 * Mengambil 5 Berita Terbaru untuk Carousel
 */
const getCarouselBeritaHandler = async (req, res) => {
  try {
    const snapshot = await db.collection('berita')
      .orderBy('tanggal_publikasi', 'desc')
      .limit(5)
      .select('judul', 'slug', 'url_gambar')
      .get();
      
    const carouselList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan data untuk carousel",
      data: carouselList
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal mendapatkan data carousel",
    });
  }
};

/**
 * Menghapus Berita berdasarkan Slug
 */
const deleteBeritaHandler = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            const error = new Error("Parameter 'slug' berita harus disertakan");
            error.statusCode = 400;
            throw error;
        }

        const snapshot = await db.collection('berita').where('slug', '==', slug).limit(1).get();

        if (snapshot.empty) {
            const error = new Error("Berita dengan slug tersebut tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        const doc = snapshot.docs[0];
        const dataBerita = doc.data();

        if (dataBerita.cloudinary_public_id) {
            await cloudinary.uploader.destroy(dataBerita.cloudinary_public_id);
        }

        await doc.ref.delete();

        res.status(200).json({
            status: "success",
            message: `Berita dengan slug "${slug}" berhasil dihapus`,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Server gagal untuk menghapus berita",
        });
    }
};

module.exports = {
  createBeritaHandler,
  getAllBeritaHandler,
  getBeritaBySlugHandler,
  getCarouselBeritaHandler,
  deleteBeritaHandler,
};