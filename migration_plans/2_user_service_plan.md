# Panduan Eksekusi: User Service

Dokumen ini adalah panduan untuk mengekstrak dan menjalankan **User Service**. Service ini berjalan di Port `3001` dan hanya fokus mengelola tabel `User`.

## 1. Persiapan Folder & Dependencies
1. Buat folder `backend/microservices/user-service`.
2. Buka terminal di folder tersebut dan jalankan:
   ```bash
   npm init -y
   npm install express cors dotenv jsonwebtoken bcrypt prisma @prisma/client
   npm install --save-dev nodemon
   ```

## 2. Inisialisasi Database (Prisma)
1. Jalankan `npx prisma init` di dalam `user-service`.
2. Edit file `prisma/schema.prisma`. **Hanya masukkan** `model User` dan enum `Role` (HAPUS relasi `orders Order[]` karena model Order tidak ada di database ini).

**Contoh `schema.prisma` yang benar:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  CUSTOMER
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password      String
  phone         String
  address       String?   @db.Text
  role          Role      @default(CUSTOMER)
  refresh_token String?   @db.Text
  avatar_url    String?
  created_at    DateTime  @default(now())
}
```
3. Sesuaikan `DATABASE_URL` di file `.env` (misalnya arahkan ke database `snowwash_user_db`).
4. Jalankan `npx prisma db push`.

## 3. Pemindahan Logika & Controller
1. Buat struktur folder `src/controllers`, `src/routes`, `src/middlewares`, dan `src/utils`.
2. Dari proyek Monolit yang lama, **Pindahkan (Copy-Paste)** file-file berikut ke folder `user-service` yang baru:
   - `authController.js`
   - `userController.js`
   - `authRoutes.js`
   - `userRoutes.js`
   - Middleware otentikasi (`authMiddleware.js` jika ada)
3. Pastikan tidak ada *error import*. Jika di controller lama ada pemanggilan `prisma.order`, hapus atau komen kode tersebut (karena User Service tidak mengurus Order).

## 4. Pembuatan File Server (`index.js`)
Buat `src/index.js` dengan isi:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Daftarkan Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`✅ User Service berjalan di http://localhost:${PORT}`);
});
```

## 5. Pengujian
Jalankan `npm run dev` (pastikan script-nya ada di package.json) dan coba panggil `GET http://localhost:3001/api/users` melalui Postman.
