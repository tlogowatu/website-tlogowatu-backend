const { db } = require('../config/firebaseConfig');

// In-memory cache sederhana untuk menyimpan data desa
const cache = {
  data: null,
  timestamp: 0,
  TTL: 600000 // Time To Live: 10 menit (dalam milidetik)
};

const getAllDataHandler = async (req, res) => {
  try {
    // 1. Cek cache terlebih dahulu
    if (cache.data && (Date.now() - cache.timestamp < cache.TTL)) {
      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan data dari cache",
        data: cache.data
      });
    }

    // 2. Jika cache kosong atau sudah kedaluwarsa, ambil data dari Firestore
    const snapshot = await db.collection('dusun').get();
    const detailDusun = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (detailDusun.length === 0) {
      return res.status(404).json({ status: "fail", message: "Data dusun tidak ditemukan" });
    }

    // 3. Hitung total data
    const totalData = detailDusun.reduce((total, dusun) => {
      total.jumlah_pria += dusun.jumlah_pria || 0;
      total.jumlah_wanita += dusun.jumlah_wanita || 0;
      total.total_penduduk += (dusun.jumlah_pria || 0) + (dusun.jumlah_wanita || 0);
      return total;
    }, { jumlah_pria: 0, jumlah_wanita: 0, total_penduduk: 0 });

    const responseData = { totalData, detailDusun };
    
    // 4. Simpan hasil ke cache
    cache.data = responseData;
    cache.timestamp = Date.now();

    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan data dari database",
      data: responseData
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateDataHandler = async(req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    // --- TAMBAHKAN VALIDASI DI SINI ---
    const dusunYangDiizinkan = ['tlogowatu', 'mendak', 'sumberejo'];
    if (!dusunYangDiizinkan.includes(id)) {
      const error = new Error("ID Dusun tidak valid. Gunakan 'tlogowatu', 'mendak', atau 'sumberejo'.");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    if (!id || Object.keys(newData).length === 0) {
        const error = new Error("ID Dusun dan data baru diperlukan");
        error.statusCode = 400;
        throw error;
    }
    
    const docRef = db.collection('dusun').doc(id);
    await docRef.update(newData);

    // Penting: Hapus cache setelah data diupdate
    cache.data = null;
    cache.timestamp = 0;

    res.status(200).json({
      status: "success",
      message: `Data untuk dusun ${id} berhasil diperbarui.`,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: "error", message: error.message });
  }
};

module.exports = { getAllDataHandler, updateDataHandler };