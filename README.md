# ❄️ SnowWash - Sistem Informasi Laundry (Microservices Architecture)

SnowWash adalah aplikasi pengelolaan dan pemesanan layanan laundry modern yang terbagi menjadi dua bagian: antarmuka pelanggan (Pemesanan Layanan, Profil) dan panel administrasi (Dashboard, Manajemen Pesanan, Layanan).

Projek ini telah **dimigrasi dari Arsitektur Monolitik menjadi Microservices (Macroservices)** untuk kemudahan skalabilitas.

Dibangun menggunakan teknologi modern: **React (Vite)** untuk Frontend, dan **Node.js + Express + Prisma ORM + MySQL** untuk Backend.

---

## 🛠️ Persyaratan Sistem (Prerequisites)

Sebelum menjalankan projek ini di laptop/server Anda, pastikan perangkat lunak berikut sudah terinstal:
1. **Node.js** (Disarankan versi LTS, misal v18 atau v20)
2. **Git** (Untuk meng-clone repositori)
3. **MySQL Server** (Bisa didapatkan dengan menginstal **XAMPP**, **Laragon**, atau **MySQL Workbench**)
4. **PM2** (Sangat disarankan untuk menjalankan microservices secara bersamaan di background):
   ```bash
   npm install -g pm2
   ```

---

## 🚀 Cara Instalasi dan Menjalankan Projek

Ikuti langkah-langkah di bawah ini secara berurutan agar projek berjalan sempurna di PC/Laptop Anda.

### 1. Salin (Clone) Projek ke Laptop Anda
Buka terminal/Command Prompt dan jalankan:
```bash
git clone https://github.com/ghfr97/FP-PW-IF03-3.git
cd snowwash
```

### 2. Konfigurasi Database & Environment Variables (.env)
Buka aplikasi *database manager* seperti phpMyAdmin (biasanya di `http://localhost/phpmyadmin`) atau MySQL Workbench, lalu **buat 3 (tiga) database kosong**:
1. `snowwash_user_db`
2. `snowwash_catalog_db`
3. `snowwash_transaction_db`

Selanjutnya, Anda **wajib** membuat/mengatur file `.env` di beberapa tempat. *Catatan penting: Pada `DATABASE_URL` di bawah ini, ubah `password_mysql_anda` dengan password root MySQL di laptop Anda. Jika tidak memakai password, ubah menjadi `root:@localhost:3306`.*

**A. Root Projek (Frontend)**
Buat file `.env` di folder utama (`snowwash/.env`) dan isi dengan:
```env
VITE_MIDTRANS_CLIENT_KEY=Mid-client-9wCkfNivQiSSwmD0
```

**B. User Service**
Buat file `.env` di folder `backend/microservices/user-service/.env` dan isi dengan:
```env
DATABASE_URL="mysql://root:password_mysql_anda@localhost:3306/snowwash_user_db"
JWT_SECRET="super_secret_access_key_123"
JWT_REFRESH_SECRET="super_secret_refresh_key_456"
PORT=3001
```

**C. Catalog Service**
Buat file `.env` di folder `backend/microservices/catalog-service/.env` dan isi dengan:
```env
DATABASE_URL="mysql://root:password_mysql_anda@localhost:3306/snowwash_catalog_db"
CLOUDINARY_CLOUD_NAME=do7xy1wxy
CLOUDINARY_API_KEY=197825345758249
CLOUDINARY_API_SECRET=eYm6jC-f97vB0T8K5Fp5Z49fQKg
PORT=3002
JWT_SECRET="super_secret_access_key_123"
```

**D. Transaction Service**
Buat file `.env` di folder `backend/microservices/transaction-service/.env` dan isi dengan:
```env
DATABASE_URL="mysql://root:password_mysql_anda@localhost:3306/snowwash_transaction_db"
JWT_SECRET="super_secret_access_key_123"
CLOUDINARY_CLOUD_NAME=do7xy1wxy
CLOUDINARY_API_KEY=197825345758249
CLOUDINARY_API_SECRET=eYm6jC-f97vB0T8K5Fp5Z49fQKg
PORT=3003
USER_SERVICE_URL="http://localhost:3001"
CATALOG_SERVICE_URL="http://localhost:3002"
```

### 3. Instalasi dan Setup Microservices
Proyek ini memiliki 4 komponen backend. Buka terminal dan masuk ke setiap folder tersebut untuk menginstal pustaka (dependencies) dan menyinkronkan skema databasenya:

**A. User Service:**
```bash
cd backend/microservices/user-service
npm install
npx prisma db push
```

**B. Catalog Service:**
```bash
cd ../catalog-service
npm install
npx prisma db push
```

**C. Transaction Service:**
```bash
cd ../transaction-service
npm install
npx prisma db push
```

**D. API Gateway:**
```bash
cd ../api-gateway
npm install
```

### 4. Menjalankan Projek
Terdapat dua opsi untuk menjalankan projek. Untuk pengembangan (*development*) di laptop, **Opsi 1** sangat disarankan.

**Opsi 1: Menjalankan Semua Sekaligus dengan 1 Perintah (Sangat Disarankan)**
Kembali ke folder utama projek (`snowwash`), lalu jalankan:
```bash
# Instal pustaka di root folder (dibutuhkan untuk menjalankan concurrently)
npm install

# Jalankan Frontend dan Semua Backend Service sekaligus!
npm run start:all
```
Jika sukses, terminal akan memberikan URL lokal (biasanya `http://localhost:5173`). Klik atau buka URL tersebut di *browser* Anda! Semua microservices (User, Catalog, Transaction, API Gateway) akan otomatis berjalan di terminal yang sama.

**Opsi 2: Menggunakan PM2 (Cocok untuk Background/Production)**
Jika Anda ingin menjalankan backend di background agar terminal tidak penuh:
```bash
cd backend/microservices/api-gateway
pm2 start index.js --name "api-gateway"

cd ../user-service
pm2 start src/index.js --name "user-service"

cd ../catalog-service
pm2 start src/index.js --name "catalog-service"

cd ../transaction-service
pm2 start src/index.js --name "transaction-service"
```
*(Cek status semuanya dengan perintah `pm2 list`)*

Lalu untuk menjalankan Frontend, buka terminal baru di folder utama projek (`snowwash`), jalankan:
```bash
npm install
npm run dev
```

---

## 📂 Struktur Projek Baru
```text
snowwash/
├── backend/
│   └── microservices/
│       ├── api-gateway/         # Menerima semua request dan meneruskannya (Port 5000)
│       ├── catalog-service/     # Mengurus Layanan/Service (Port 3002)
│       ├── transaction-service/ # Mengurus Order, Payment, Analytics (Port 3003)
│       └── user-service/        # Mengurus Auth dan data pelanggan (Port 3001)
├── src/                         # Folder React Frontend (Vite)
├── migration_plans/             # Dokumen rekam jejak migrasi ke Microservice
└── README.md
```

Selamat mengembangkan! 🚀
