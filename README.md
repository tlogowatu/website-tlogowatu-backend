# Backend - Website Profil Desa Tlogowatu

Ini adalah server backend yang menyediakan API untuk website profil Desa Tlogowatu. Dibuat menggunakan Node.js dan Express, dengan database Firestore dan penyimpanan gambar Cloudinary.

## Teknologi yang Digunakan

* **Node.js**: Lingkungan eksekusi JavaScript.
* **Express.js**: Framework web untuk membangun API.
* **Firebase Firestore**: Database NoSQL untuk menyimpan data.
* **Cloudinary**: Layanan untuk menyimpan dan mengelola gambar.
* **JSON Web Token (JWT)**: Untuk autentikasi rute admin yang aman.
* **Multer**: Middleware untuk menangani upload file.

## Persiapan Awal

Sebelum memulai, pastikan Anda memiliki:

1.  **Node.js** terinstal di komputer Anda.
2.  Akun **Firebase** dan **Cloudinary** yang sudah dibuat.

## Instalasi & Konfigurasi

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/tlogowatu/website-tlogowatu-backend
    cd backend-berita-desa
    ```

2.  **Install Dependensi**
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
    
    # Kredensial untuk Login Admin
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=desa_tlogowatu_2025
    JWT_SECRET=kunci-rahasia-yang-sangat-panjang-dan-aman
    ```

4.  **Konfigurasi Kunci Firebase**
    * Unduh file `serviceAccountKey.json` dari konsol Firebase Anda.
    * Letakkan file tersebut di folder utama proyek.
    * **Penting:** Pastikan nama file ini sudah ditambahkan ke dalam `.gitignore`.

## Menjalankan Server

Untuk menjalankan server pengembangan, gunakan perintah:
```bash
node server.js
```
Server akan berjalan di `http://localhost:8000`.

## Daftar API Endpoint

### Autentikasi
* `POST /api/auth/login`
    * **Deskripsi:** Melakukan login untuk admin. Membutuhkan body JSON `{ "username": "...", "password": "..." }`. Mengembalikan token JWT jika berhasil.

### Berita
* `POST /api/berita` 🔒 **(Dilindungi)**
    * **Deskripsi:** Membuat berita baru. Membutuhkan token JWT di header `Authorization`.
* `GET /api/berita`
    * **Deskripsi:** Mengambil daftar semua berita.
* `GET /api/berita/carousel`
    * **Deskripsi:** Mengambil 5 berita terbaru untuk carousel.
* `GET /api/berita/:slug`
    * **Deskripsi:** Mengambil detail satu berita.
* `DELETE /api/berita/:slug` 🔒 **(Dilindungi)**
    * **Deskripsi:** Menghapus satu berita. Membutuhkan token JWT di header `Authorization`.

### Data Desa
* `GET /api/data`
    * **Deskripsi:** Mengambil data agregat desa dan rincian dusun.
* `PUT /api/data/:id` 🔒 **(Dilindungi)**
    * **Deskripsi:** Memperbarui data dusun. Membutuhkan token JWT di header `Authorization`.
