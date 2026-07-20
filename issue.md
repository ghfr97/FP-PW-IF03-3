# Perencanaan Implementasi CRUD Penuh & Soft-Delete (Microservices)

Dokumen ini berisi panduan teknis langkah demi langkah untuk menyelesaikan implementasi fitur CRUD (Pesanan, Pelanggan, Layanan) pada aplikasi SnowWash. Panduan ini dirancang agar mudah diikuti oleh *Junior Programmer* atau AI Assistant.

---

## 1. Modul Layanan (Services) - Fitur Hide/Soft Delete
**Tujuan:** Layanan yang berstatus `INACTIVE` tidak boleh dihapus secara permanen dari database agar riwayat pesanan masa lalu tidak rusak. Layanan ini harus tetap terlihat di halaman Admin, tetapi disembunyikan dari halaman publik (User).

### A. Frontend (`src/pages/Jasa.jsx`)
1. Cari baris pemanggilan API `api.get('/services')` di dalam `useQuery`.
2. Lakukan *filtering* (*filter*) pada `response.data` agar **hanya** layanan yang memiliki `status === 'ACTIVE'` yang dikembalikan ke *state* dan di-*render* ke halaman pengguna.
   ```javascript
   // Contoh:
   const response = await api.get('/services');
   const activeServices = response.data.filter(s => s.status === 'ACTIVE');
   return activeServices.map(s => ({ ... }));
   ```

### B. Backend (`backend/microservices/catalog-service/src/controllers/serviceController.js`)
1. Cari fungsi `deleteService`.
2. Saat ini fungsi tersebut menggunakan `prisma.service.delete`. Ubah logika tersebut menjadi **Soft Delete** menggunakan `prisma.service.update`.
3. Ganti field `status` menjadi `INACTIVE` alih-alih menghapus baris data tersebut dari database.

---

## 2. Modul Pelanggan (Customers) - CRUD Admin
**Tujuan:** Menghidupkan fitur Tambah, Edit, dan Hapus pelanggan di halaman Admin (saat ini tombolnya hanya memunculkan notifikasi "Belum didukung backend").

### A. Backend (`backend/microservices/user-service`)
1. Buka file `src/routes/userRoutes.js`.
2. Tambahkan 3 *endpoint* baru khusus Admin (pastikan menggunakan *middleware* `verifyToken` dan `requireAdmin`):
   - `POST /` (Untuk menambah pengguna baru secara manual).
   - `PUT /:id` (Untuk mengedit nama, nomor telepon, alamat, dll).
   - `DELETE /:id` (Untuk menghapus pengguna).
3. Buka file `src/controllers/userController.js` dan buatkan ketiga fungsi *controller* dari *endpoint* di atas dengan menggunakan ORM Prisma (`prisma.user.create`, `prisma.user.update`, `prisma.user.delete`).

### B. Frontend (`src/pages/admin/Customers.jsx`)
1. Temukan fungsi `handlePelanggan`, `handleSave`, dan `handleHapus`.
2. Hapus baris kode `showToast('⚠️ Fitur ... belum didukung backend', 'error')`.
3. Buat 3 buah `useMutation` (React Query) yang memanggil `api.post`, `api.put`, dan `api.delete` ke *endpoint* `/users` yang baru saja dibuat di backend.
4. Jangan lupa panggil `queryClient.invalidateQueries(['admin-customers'])` setiap kali operasi berhasil (*onSuccess*) agar tabel ter-refresh otomatis.

---

## 3. Modul Pesanan (Orders) - Manajemen Admin
**Tujuan:** Mengaktifkan fitur Tambah Pesanan Manual dan Hapus Pesanan dari halaman Admin.

### A. Backend (`backend/microservices/transaction-service`)
1. Buka `src/routes/orderRoutes.js`.
2. Buat *endpoint* `DELETE /:id` khusus Admin.
3. (Opsional namun direkomendasikan): Jangan hapus pesanan menggunakan `prisma.order.delete` karena berkaitan dengan data pembayaran (`Payment`). Sebagai gantinya, ubah nilai statusnya menjadi `BATAL` / `CANCELED`.
4. Implementasikan fungsinya di `src/controllers/orderController.js`.

### B. Frontend (`src/pages/admin/Orders.jsx`)
1. Temukan fungsi `handleHapus` dan `handleTambah`.
2. Hapus *toast error* bawaan.
3. Implementasikan pemanggilan API menggunakan `useMutation` ke rute backend yang bersesuaian, sama seperti cara yang dilakukan pada modul Pelanggan.

---
**Catatan untuk Developer/AI:** Kerjakan modul ini satu per satu (Layanan -> Pelanggan -> Pesanan) untuk mencegah konflik kode. Uji coba fungsionalitas tombol di Admin Panel setiap kali 1 modul selesai dikerjakan!
