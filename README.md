# ❄️ SnowWash - Sistem Informasi Laundry

SnowWash adalah aplikasi pengelolaan dan pemesanan layanan laundry modern yang terbagi menjadi dua bagian: antarmuka pelanggan (Pemesanan Layanan, Profil) dan panel administrasi (Dashboard, Manajemen Pesanan, Layanan). 

Projek ini dibangun menggunakan teknologi modern: **React (Vite)** untuk Frontend, dan **Node.js + Express + Prisma ORM + MySQL** untuk Backend.

---

## 🛠️ Persyaratan Sistem (Prerequisites)

Sebelum menjalankan projek ini di laptop Anda, pastikan perangkat lunak berikut sudah terinstal:
1. **Node.js** (Disarankan versi LTS, misal v18 atau v20)
2. **Git** (Untuk meng-clone repositori)
3. **MySQL Server** (Bisa didapatkan dengan menginstal **XAMPP**, **Laragon**, atau **MySQL Workbench**)

---

## 🚀 Cara Instalasi dan Menjalankan Projek

Ikuti langkah-langkah di bawah ini secara berurutan agar projek berjalan sempurna tanpa *error*.

### 1. Salin (Clone) Projek ke Laptop Anda
Buka terminal/Command Prompt dan jalankan:
```bash
git clone https://github.com/ghfr97/FP-PW-IF03-2.git
cd snowwash
```

### 2. Konfigurasi Backend & Database (Wajib dilakukan pertama)

Pastikan server MySQL Anda sudah menyala (Start MySQL di XAMPP/Laragon). Buka aplikasi *database manager* seperti phpMyAdmin (biasanya di `http://localhost/phpmyadmin`), lalu **buat sebuah database kosong** bernama: `snowwash_db`.

Selanjutnya, buka terminal baru dan jalankan konfigurasi *backend*:
```bash
# 1. Masuk ke folder backend
cd backend

# 2. Instal semua pustaka (library) yang dibutuhkan
npm install

# 3. Buat file .env (Konfigurasi Database & Secrets)
# Buat file bernama `.env` di dalam folder backend, lalu isi dengan format berikut:
# PORT=5001
# FRONTEND_URL=http://localhost:5173
# DATABASE_URL="mysql://root:@localhost:3306/snowwash_db"
#
# JWT_SECRET="RAHASIA_JWT_YANG_SANGAT_PANJANG_DAN_AMAN"
# JWT_REFRESH_SECRET="RAHASIA_REFRESH_JWT_YANG_SANGAT_PANJANG"
# 
# CLOUDINARY_CLOUD_NAME="your_cloud_name"
# CLOUDINARY_API_KEY="your_api_key"
# CLOUDINARY_API_SECRET="your_api_secret"
#
# MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
# MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
# MIDTRANS_IS_PRODUCTION="false"

# 4. Bangun struktur tabel ke MySQL (Otomatis)
npx prisma db push

# 5. Isi database dengan data bawaan (Akun admin & daftar layanan default)
npx prisma db seed

# 6. Nyalakan server backend
npm run dev
```
Jika sukses, terminal akan menampilkan: `✅ Server berjalan di http://localhost:5001`. **(Biarkan terminal ini tetap menyala).**

### 3. Konfigurasi Frontend (Tampilan Web)

Buka terminal **baru** (biarkan terminal *backend* tadi tetap jalan), pastikan Anda berada di folder utama projek (`snowwash`), lalu jalankan:

```bash
# 1. Instal semua pustaka frontend
npm install

# 2. Buat file .env di root projek frontend (opsional untuk pembayaran otomatis)
# Isi file dengan kunci publik Midtrans Anda:
# VITE_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"

# 3. Nyalakan server frontend
npm run dev
```
Jika sukses, terminal akan memberikan URL lokal (biasanya `http://localhost:5173`). Klik atau buka URL tersebut di *browser* Anda!

---

## 🔑 Akses Akun Bawaan (Default Accounts)

Karena Anda telah menjalankan perintah `npm run seed` di langkah ke-2, *database* otomatis diisi dengan satu akun super admin.

**Akses Admin Panel:**
- **Email:** `admin@snowwash.com`
- **Password:** `admin123`

Untuk *login* sebagai pelanggan biasa, Anda cukup melakukan registrasi melalui tombol "Daftar" di halaman *Login*.

---

## 📂 Struktur Projek
```text
snowwash/
├── backend/                # Folder Node.js Backend API
│   ├── prisma/             # Skema database & file Seed
│   ├── src/                # Kode sumber backend (Routes, Controllers, Middleware)
│   └── .env                # File rahasia penghubung database
├── src/                    # Folder React Frontend
│   ├── components/         # Komponen UI yang dapat digunakan kembali
│   ├── pages/              # Halaman utama (Home, Admin, Login, dll)
│   ├── lib/                # Konfigurasi penghubung API (Axios)
│   └── store/              # Manajemen State Global (Zustand)
└── package.json            # Daftar pustaka Frontend
```

Selamat mengembangkan! 🚀
