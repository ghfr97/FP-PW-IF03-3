# Panduan Eksekusi: Catalog Service

Dokumen ini adalah panduan untuk mengekstrak dan menjalankan **Catalog Service**. Service ini berjalan di Port `3002` dan hanya fokus mengelola tabel `Service` (Daftar Layanan Laundry).

## 1. Persiapan Folder & Dependencies
1. Buat folder `backend/microservices/catalog-service`.
2. Buka terminal di folder tersebut dan jalankan:
   ```bash
   npm init -y
   npm install express cors dotenv prisma @prisma/client multer
   npm install --save-dev nodemon
   ```

## 2. Inisialisasi Database (Prisma)
1. Jalankan `npx prisma init` di dalam `catalog-service`.
2. Edit file `prisma/schema.prisma`. **Hanya masukkan** `model Service` dan enum `ServiceStatus`. (HAPUS relasi `order_items OrderItem[]` karena model OrderItem tidak ada di database ini).

**Contoh `schema.prisma` yang benar:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum ServiceStatus {
  ACTIVE
  INACTIVE
}

model Service {
  id            Int             @id @default(autoincrement())
  name          String
  description   String?         @db.Text
  price         Int
  unit          String          // contoh: "/kg", "/pcs"
  image_url     String?
  status        ServiceStatus   @default(ACTIVE)
  created_at    DateTime        @default(now())
}
```
3. Sesuaikan `DATABASE_URL` di file `.env` (misalnya arahkan ke database `snowwash_catalog_db`).
4. Jalankan `npx prisma db push`.

## 3. Pemindahan Logika & Controller
1. Buat struktur folder `src/controllers` dan `src/routes`.
2. Dari proyek Monolit yang lama, **Pindahkan (Copy-Paste)** file-file berikut ke folder `catalog-service`:
   - `serviceController.js`
   - `serviceRoutes.js`
3. Jika ada fungsi untuk mengupload gambar (multer), pastikan *middleware upload* nya juga disalin ke service ini.

## 4. Pembuatan File Server (`index.js`)
Buat `src/index.js` dengan isi:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Untuk serve file statis upload (jika ada)
app.use('/uploads', express.static('uploads'));

// Daftarkan Routes
app.use('/api/services', serviceRoutes);

app.listen(PORT, () => {
    console.log(`✅ Catalog Service berjalan di http://localhost:${PORT}`);
});
```

## 5. Pengujian
Jalankan `npm run dev` dan coba panggil `GET http://localhost:3002/api/services` melalui Postman. Pastikan daftar layanannya muncul.
