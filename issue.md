# Issue: Melengkapi API Manajemen Layanan (Services) - PRD 5.B

## 📌 Latar Belakang
Sesuai dengan PRD Bagian 5.B, backend diwajibkan untuk menyediakan fitur manajemen layanan (Services) secara penuh (CRUD) khusus untuk akses Admin, lengkap dengan pengunggahan foto menggunakan Cloudinary serta validasi input yang ketat menggunakan Zod.

Saat ini di `backend/src/routes/serviceRoutes.js`, baru tersedia endpoint:
- `GET /` (Melihat daftar layanan)
- `POST /` (Menambah layanan, tapi **belum** terintegrasi dengan upload Cloudinary dan Zod).

Endpoint yang hilang dan wajib ditambahkan:
- ❌ `PUT /api/services/:id` (Mengubah deskripsi/harga layanan).
- ❌ `DELETE /api/services/:id` (Menghapus layanan).
- ❌ Integrasi Cloudinary saat POST dan PUT layanan.
- ❌ Validasi Zod (`serviceValidation.js`).

---

## 🛠️ Langkah-langkah Implementasi (Untuk Junior Programmer / AI Model)

Ikuti tahapan ini secara berurutan agar pengembangan berjalan mulus tanpa merusak *codebase* yang sudah ada.

### Tahap 1: Pembuatan Validasi Zod
1. Buat file baru: `backend/src/utils/validations/serviceValidation.js`.
2. Import `z` dari `zod`.
3. Buat dua skema validasi:
   - `createServiceSchema`: Wajib memiliki `name`, `price` (harus angka positif), `unit` (string), dan opsional `description`.
   - `updateServiceSchema`: Sama seperti di atas, tapi semua field jadikan `.optional()` karena admin mungkin hanya ingin mengupdate harga saja tanpa mengubah nama.
4. Export kedua skema tersebut.

### Tahap 2: Modifikasi Controller (`serviceController.js`)
Buka `backend/src/controllers/serviceController.js` dan lakukan perubahan berikut:

1. **Refactor `createService`**:
   - Fungsi ini sekarang harus menerima *file upload* dari form-data.
   - Periksa apakah `req.file` ada. Jika ada, panggil utilitas Cloudinary (contoh: `cloudinary.uploader.upload_stream` seperti yang dilakukan di `uploadAvatar`) untuk mengunggah gambar tersebut.
   - Simpan URL gambar yang dikembalikan Cloudinary ke dalam kolom `image_url` saat memanggil `prisma.service.create`.

2. **Buat Fungsi `updateService`**:
   - Tangkap parameter ID dari `req.params.id`.
   - Lakukan logika yang sama seperti create: periksa apakah ada `req.file`. Jika ada, unggah ke Cloudinary dan dapatkan URL-nya.
   - Panggil `prisma.service.update` dengan `data` gabungan dari `req.body` dan `image_url` (jika ada file baru).

3. **Buat Fungsi `deleteService`**:
   - Tangkap parameter ID dari `req.params.id`.
   - Panggil `prisma.service.delete` untuk menghapus data berdasarkan ID.
   - (Opsional namun disarankan): Hapus aset terkait di Cloudinary menggunakan *public ID*.

### Tahap 3: Menyambungkan Routes (`serviceRoutes.js`)
Buka `backend/src/routes/serviceRoutes.js`.

1. Import fungsi `updateService` dan `deleteService` dari controller.
2. Import middleware `uploadMiddleware` (biasanya `require('../middlewares/uploadMiddleware')`).
3. Import `validateRequest` dan skema dari tahap 1.
4. **Pembaruan POST Route**:
   Ganti rute POST saat ini menjadi:
   `router.post('/', verifyToken, requireAdmin, upload.single('image'), validateRequest(createServiceSchema), serviceController.createService);`
5. **Penambahan PUT & DELETE Route**:
   - Tambahkan rute PUT:
     `router.put('/:id', verifyToken, requireAdmin, upload.single('image'), validateRequest(updateServiceSchema), serviceController.updateService);`
   - Tambahkan rute DELETE:
     `router.delete('/:id', verifyToken, requireAdmin, serviceController.deleteService);`

### Tahap 4: Pengujian (Testing)
- Gunakan Postman, Insomnia, atau Thunder Client.
- Gunakan `POST /api/auth/login` dengan akun Admin untuk mendapatkan *Access Token*.
- Kirim HTTP POST ke `/api/services` menggunakan tipe **multipart/form-data**. Masukkan kolom `name`, `price`, `unit`, dan *file image*. Pastikan data tersimpan dan gambar berhasil masuk Cloudinary.
- Uji `PUT` dan `DELETE` untuk memastikan integrasi terhubung 100%.
