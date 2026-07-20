# Rencana Migrasi Monolit ke Microservices (Snowwash) - *Revised Pragmatic Approach*

Dokumen ini berisi panduan dan rencana bertahap (roadmap) untuk memigrasikan aplikasi Snowwash dari arsitektur Monolit menjadi Microservices. 

Berdasarkan skala proyek (aplikasi laundry), pendekatan *granular microservices* (memecah menjadi 5 service) dinilai **berlebihan (overkill)** dan akan menyulitkan developer (terutama junior) dalam mengelola *Distributed Transactions* dan *Event Sourcing*. Oleh karena itu, kita menggunakan pendekatan **Pragmatic Microservices (Macroservices)** yang lebih cocok untuk proyek ini.

## 1. Analisis & Dekomposisi Layanan (Service Decomposition)

Sistem akan dipecah menjadi 3 (tiga) microservices utama yang logis dan tidak terlalu rumit:

1. **User Service**: 
   - **Tabel**: `User`
   - **Tanggung Jawab**: Mengelola registrasi pelanggan, manajemen admin, dan autentikasi (JWT).
2. **Catalog Service**: 
   - **Tabel**: `Service`
   - **Tanggung Jawab**: Mengelola master data layanan cuci (daftar jasa, harga, dan deskripsi).
3. **Transaction & Analytics Service**: 
   - **Tabel**: `Order`, `OrderItem`, `Payment`
   - **Tanggung Jawab**: Mengelola pembuatan pesanan, status pesanan, pembayaran, serta menyediakan fitur pelaporan (Analytics). Penggabungan ini dilakukan karena Order dan Payment sangat erat kaitannya (*tightly coupled*), sehingga memisahkannya akan mempersulit validasi transaksi.

## 2. Arsitektur Tujuan (Target Architecture)

- **API Gateway**: Pintu masuk tunggal bagi aplikasi Frontend (merutekan traffic ke 3 service di atas).
- **Database per Service**: Setiap microservice memiliki file SQLite/database tersendiri.
- **Komunikasi Antar Service (Synchronous)**: Menggunakan REST API (Axios/Fetch) antar service. 
  - *Contoh 1*: Saat membuat order, Transaction Service memanggil Catalog Service untuk memastikan layanan tersedia dan mengambil harga terbaru.
  - *Contoh 2*: Saat memuat Analytics (Top Customers), Transaction Service memanggil User Service untuk mengambil detail nama pelanggan.

---

## 3. Pembagian Task (Task Breakdown)

### Phase 1: Persiapan Infrastruktur & API Gateway
- [ ] **Task 1.1: Setup Repositori.** Buat folder `microservices` dengan 3 sub-folder (`user-service`, `catalog-service`, `transaction-service`).
- [ ] **Task 1.2: Implementasi API Gateway.** Setup API Gateway (misal menggunakan Express Gateway / Nginx) untuk merutekan URL.

### Phase 2: Ekstraksi User Service
- [ ] **Task 2.1: Inisiasi Database.** Buat `schema.prisma` yang hanya berisi model `User`.
- [ ] **Task 2.2: Migrasi Logika Kode.** Pindahkan `authRoutes.js`, `userRoutes.js`, dan utilitas JWT ke `user-service`.
- [ ] **Task 2.3: Routing.** Arahkan traffic `/api/auth` dan `/api/users` ke User Service (Port 3001).

### Phase 3: Ekstraksi Catalog Service
- [ ] **Task 3.1: Inisiasi Database.** Buat `schema.prisma` yang hanya berisi model `Service`.
- [ ] **Task 3.2: Migrasi Logika Kode.** Pindahkan `serviceRoutes.js`.
- [ ] **Task 3.3: Routing.** Arahkan traffic `/api/services` ke Catalog Service (Port 3002).

### Phase 4: Ekstraksi Transaction & Analytics Service
- [ ] **Task 4.1: Inisiasi Database.** Buat `schema.prisma` yang berisi `Order`, `OrderItem`, dan `Payment`. Ubah relasi `@relation` ke `User` dan `Service` menjadi sekadar referensi ID (tipe data biasa).
- [ ] **Task 4.2: Migrasi Order & Payment.** Pindahkan `orderRoutes.js` dan `paymentRoutes.js`. 
- [ ] **Task 4.3: Implementasi Komunikasi Antar Service.** Perbarui *Order Controller* agar saat transaksi dibuat, ia memanggil API Catalog Service untuk mendapatkan harga yang valid.
- [ ] **Task 4.4: Migrasi Analytics.** Pindahkan `analyticsRoutes.js`. Perbarui logika SQL di `analyticsController.js` agar memanggil API User Service jika membutuhkan data nama/email pengguna (sebab tabel User tidak ada di database ini).
- [ ] **Task 4.5: Routing.** Arahkan traffic `/api/orders`, `/api/payments`, dan `/api/analytics` ke Transaction Service (Port 3003).

### Phase 5: Pengujian & Transisi
- [ ] **Task 5.1: End-to-End Testing.** Lakukan testing _checkout_ pesanan dari hulu ke hilir.
- [ ] **Task 5.2: Pensiunkan Monolit.** Matikan server Monolit yang lama.
