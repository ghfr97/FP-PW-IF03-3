# Issue: Implementasi Dekomposisi Layanan (Pragmatic Microservices) - Snowwash

**Konteks Tugas:**
Tugas ini bertujuan untuk memecah arsitektur backend aplikasi Snowwash dari bentuk monolitik menjadi arsitektur berbasis Microservices. Agar tidak terlalu rumit (overkill) dan lebih mudah dikelola, kita akan menggunakan pendekatan *Macroservices* (3 layanan) alih-alih memecahnya menjadi terlalu kecil.

## Daftar Microservices yang Akan Dibuat

Proyek ini akan dipecah menjadi 3 (tiga) layanan independen:
1. **User Service**: Mengelola registrasi pelanggan, admin, dan autentikasi JWT. (Tabel: `User`)
2. **Catalog Service**: Mengelola master data layanan cuci (services) dan harga. (Tabel: `Service`)
3. **Transaction Service**: Menggabungkan fungsionalitas Order, Payment, dan Analytics. (Tabel: `Order`, `OrderItem`, `Payment`).

---

## Panduan Implementasi (Step-by-Step Guide)

Bagi Junior Programmer / AI Agent yang akan mengerjakan tugas ini, silakan ikuti tahapan berikut secara berurutan. **Pastikan untuk menyelesaikan satu tahap dan memastikan kodenya berjalan (running) sebelum lanjut ke tahap berikutnya.**

### Tahap 1: Persiapan Struktur Direktori (Workspace)
1. Buat folder utama baru bernama `microservices` di dalam direktori `backend` atau di _root_ proyek.
2. Di dalam folder `microservices`, buat 3 folder baru:
   - `user-service`
   - `catalog-service`
   - `transaction-service`
3. Lakukan inisialisasi package manager (`npm init -y`) dan install *dependencies* dasar (`express`, `cors`, `dotenv`, `@prisma/client`) di dalam **setiap** folder service.

### Tahap 2: Pemisahan Database & Skema Prisma
1. Di dalam setiap folder service, jalankan `npx prisma init`.
2. Pindahkan model-model Prisma dari proyek monolitik:
   - **User Service**: Masukkan model `User`.
   - **Catalog Service**: Masukkan model `Service`.
   - **Transaction Service**: Masukkan model `Order`, `OrderItem`, dan `Payment`.
     - *Perhatian Khusus*: Pada Transaction Service, hapus relasi fisik/foreign-key langsung (`@relation`) terhadap `User` dan `Service`. Ganti *field* tersebut menjadi tipe data biasa (seperti `String` atau `Int`).
3. Buat file `.env` di masing-masing folder dan arahkan `DATABASE_URL` ke skema/database yang terpisah.
4. Jalankan `npx prisma db push` di masing-masing service untuk men-generate struktur tabel.

### Tahap 3: Pemisahan Logika Kode (Routes & Controllers)
1. **User Service**: Pindahkan `userRoutes.js`, `authRoutes.js`, dan controller terkait. Pindahkan pula *middleware* autentikasi.
2. **Catalog Service**: Pindahkan `serviceRoutes.js` dan controllernya.
3. **Transaction Service**: Pindahkan `orderRoutes.js`, `paymentRoutes.js`, `analyticsRoutes.js`, dan semua controllernya.
*(Catatan: Jangan lupa menyalin folder/file utilitas seperti enkripsi password ke service yang membutuhkan).*

### Tahap 4: Inisialisasi Server Independen
1. Buat file `index.js` (atau `server.js`) pada setiap folder service.
2. Setup *Express server* dan daftarkan *routes* yang baru dipindahkan.
3. Gunakan *port* yang **berbeda** untuk setiap service:
   - User Service: `PORT=3001`
   - Catalog Service: `PORT=3002`
   - Transaction Service: `PORT=3003`

### Tahap 5: Resolusi Komunikasi Antar Service (Inter-Service Communication)
1. Cari logika aplikasi di *controller* Transaction Service yang tadinya menggunakan query gabungan Prisma (`include: { user: true }`). Ini pasti akan error karena tabelnya terpisah.
2. Ganti pendekatan tersebut menggunakan *HTTP Request*. 
   - *Contoh Kasus*: Pada `analyticsController.js`, untuk mendapatkan data nama `User` di laporan *Top Customer*, Transaction Service harus memanggil API User Service (`GET http://localhost:3001/api/users/:id`) menggunakan pustaka `axios` atau `fetch`.
   - Hal yang sama berlaku saat *Create Order*, Transaction Service harus mengecek harga ke Catalog Service.

### Tahap 6: Pengujian Unit & Manual
1. Buka 3 terminal berbeda dan jalankan ketiga service tersebut secara bersamaan.
2. Lakukan pengecekan _end-to-end_ menggunakan _tools_ seperti Postman (misal: Tes login, buat order, lalu bayar).

---

**Kriteria Penyelesaian (Definition of Done):**
- [ ] Terdapat 3 folder service independen yang berjalan lancar.
- [ ] Tiap service menggunakan koneksi database terpisah.
- [ ] *Error* terkait pemisahan relasi database sudah diatasi menggunakan API Call antar service (REST).
