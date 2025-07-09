# Backend - Website Profil Desa Tlogowatu

Ini adalah server backend yang menyediakan API untuk website profil Desa Tlogowatu. Dibuat menggunakan Node.js dan Express, dengan database Firestore dan penyimpanan gambar Cloudinary.

## Teknologi yang Digunakan

* **Node.js**: Lingkungan eksekusi JavaScript.
* **Express.js**: Framework web untuk membangun API.
* **Firebase Firestore**: Database NoSQL untuk menyimpan data berita dan kependudukan.
* **Cloudinary**: Layanan untuk menyimpan dan mengelola gambar berita.
* **Multer**: Middleware untuk menangani upload file.

## Persiapan Awal

Sebelum memulai, pastikan Anda memiliki:

1.  **Node.js** terinstal di komputer Anda.
2.  Akun **Firebase** dan **Cloudinary** yang sudah dibuat.

## Instalasi & Konfigurasi

1.  **Clone Repositori**
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd backend-berita-desa
    ```

2.  **Install Dependensi**
    Jalankan perintah berikut di terminal:
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment (.env)**
    Buat file bernama `.env` di folder utama proyek dan isi dengan kredensial Anda:
    ```
    PORT=8000

    # Kredensial dari dashboard Cloudinary Anda
    CLOUDINARY_CLOUD_NAME="NAMA_CLOUD_ANDA"
    CLOUDINARY_API_KEY="API_KEY_ANDA"
    CLOUDINARY_API_SECRET="API_SECRET_ANDA"
    ```

4.  **Konfigurasi Kunci Firebase**
    * Unduh file `serviceAccountKey.json` dari konsol Firebase Anda.
    * Letakkan file tersebut di folder utama proyek (`backend-berita-desa/`).
    * **Penting:** Pastikan nama file ini sudah ditambahkan ke dalam `.gitignore` agar tidak terunggah ke repositori publik.

## Menjalankan Server

Untuk menjalankan server pengembangan, gunakan perintah:
```bash
node server.js
```
Server akan berjalan di `http://localhost:8000` atau port yang Anda tentukan di file `.env`.

## Daftar API Endpoint

### Berita
-   `POST /api/berita`
    -   **Deskripsi:** Membuat berita baru. Membutuhkan `form-data` dengan field `judul`, `isi_berita`, `penulis`, dan `gambar` (file).
-   `GET /api/berita`
    -   **Deskripsi:** Mengambil daftar semua berita (diurutkan dari yang terbaru).
-   `GET /api/berita/carousel`
    -   **Deskripsi:** Mengambil 5 berita terbaru untuk ditampilkan di carousel.
-   `GET /api/berita/:slug`
    -   **Deskripsi:** Mengambil detail satu berita berdasarkan slug-nya.
-   `DELETE /api/berita/:slug`
    -   **Deskripsi:** Menghapus satu berita berdasarkan slug-nya.

### Data Desa
-   `GET /api/data`
    -   **Deskripsi:** Mengambil data agregat seluruh desa dan rincian per dusun.
-   `PUT /api/data/:id`
    -   **Deskripsi:** Memperbarui data untuk dusun tertentu (`tlogowatu`, `mendak`, atau `sumberejo`). Membutuhkan body JSON dengan data yang ingin diubah (misal: `{"jumlah_pria": 100}`).