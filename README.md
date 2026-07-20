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

Ikuti langkah-langkah di bawah ini secara berurutan agar projek berjalan sempurna.

### 1. Salin (Clone) Projek ke Laptop Anda
Buka terminal/Command Prompt dan jalankan:
```bash
git clone https://github.com/ghfr97/FP-PW-IF03-3.git
cd snowwash
```

### 2. Konfigurasi Database
Buka aplikasi *database manager* seperti phpMyAdmin (biasanya di `http://localhost/phpmyadmin`), lalu **buat 3 (tiga) database kosong**:
1. `snowwash_user_db`
2. `snowwash_catalog_db`
3. `snowwash_transaction_db`

### 3. Instalasi dan Setup Microservices
Proyek ini memiliki 4 komponen backend di dalam folder `backend/microservices`:
1. `api-gateway` (Port 5000)
2. `user-service` (Port 3001)
3. `catalog-service` (Port 3002)
4. `transaction-service` (Port 3003)

Buka terminal dan masuk ke setiap folder tersebut untuk menginstal pustaka dan mendorong skema databasenya:

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

### 4. Menjalankan Semua Service dengan PM2
Agar tidak perlu membuka 4 terminal terpisah, jalankan semua service di background menggunakan PM2:
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

### 5. Konfigurasi Frontend (Tampilan Web)
Buka terminal **baru**, pastikan Anda berada di folder utama projek (`snowwash`), lalu jalankan:

```bash
# 1. Instal semua pustaka frontend
npm install

# 2. Nyalakan server frontend
npm run dev
```
Jika sukses, terminal akan memberikan URL lokal (biasanya `http://localhost:5173`). Klik atau buka URL tersebut di *browser* Anda!

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
├── frontend/ (src/)             # Folder React Frontend (Vite)
├── migration_plans/             # Dokumen rekam jejak migrasi ke Microservice
└── README.md
```

Selamat mengembangkan! 🚀
