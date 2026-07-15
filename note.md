1. Integrasi Cloudinary (File Upload) ☁️
Di dalam PRD (Bagian 2 & 5), diwajibkan menggunakan Cloudinary untuk menyimpan gambar. Namun saat ini:

Endpoint untuk upload gambar Service (Layanan) belum menangani unggahan file/foto ke Cloudinary.
Pustaka seperti cloudinary atau multer belum terinstal di package.json backend.
2. Modul Pembayaran (Payments) 💳
Di PRD (Bagian 3 & 5.D), terdapat tabel Payments dan alur unggah bukti pembayaran.

File paymentController.js dan paymentRoutes.js belum ada di folder backend.
Endpoint POST /api/orders/:id/payment (unggah bukti transfer) dan PUT /api/payments/:id/verify (verifikasi admin) belum dibuat.
3. Sistem Validasi Zod yang Kuat 🛡️
Di PRD (Bagian 4.2), disebutkan bahwa setiap input harus divalidasi dengan Zod.

Meskipun pustaka zod sudah terpasang di package.json, belum ada middleware validasi Zod (seperti validateRequest.js) maupun skema Zod (misalnya untuk mengecek email valid dan password minimal 8 karakter) di dalam kode authController.js atau orderController.js. Saat ini validasi masih manual dan sangat minim.
4. Sistem Refresh Token 🔐
Di PRD (Bagian 4.1 & 5.A), keamanan autentikasi mewajibkan penggunaan 2 token (Access Token umur pendek & Refresh Token umur panjang).

Saat ini authController.js hanya membuat satu token tunggal (token) yang kedaluwarsa dalam 1 hari.
Tabel User memiliki kolom refresh_token, namun kolom ini tidak pernah diisi.
Endpoint POST /api/auth/refresh belum dibuat.
5. Frontend: TanStack Query (React Query) 🔄
Di PRD (Bagian 6.3), disebutkan untuk menggunakan useQuery dan useMutation.

Pustaka ini sudah diinstal di package.json frontend, tapi jika belum dihubungkan dengan komponen secara ekstensif (masih pakai useEffect biasa), maka ini belum selesai sesuai standar PRD.