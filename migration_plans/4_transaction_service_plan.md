# Panduan Eksekusi: Transaction Service (Orders, Payments, Analytics)

Ini adalah *service* yang paling krusial. Transaction Service berjalan di Port `3003`. Karena kita memecah database, service ini **TIDAK** memiliki tabel User dan tabel Service, sehingga *Foreign Key* dan relasi antar tabelnya harus diubah menjadi HTTP Request biasa.

## 1. Persiapan Folder & Dependencies
1. Buat folder `backend/microservices/transaction-service`.
2. Install dependensi:
   ```bash
   npm init -y
   npm install express cors dotenv prisma @prisma/client axios
   npm install --save-dev nodemon
   ```
   *Catatan: Kita wajib menginstall `axios` untuk melakukan request ke service lain.*

## 2. Inisialisasi Database (Prisma)
1. Jalankan `npx prisma init`.
2. Edit `schema.prisma`. **PENTING:** Anda harus menghapus atribut `@relation` ke `User` dan `Service`. Tipe data `user_id` tetap `String`, dan `service_id` tetap `Int`.

**Contoh `schema.prisma` yang benar:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ... Masukkan enum OrderStatus dan PaymentStatus dari file lama ...

model Order {
  id            String        @id
  user_id       String        // INI BUKAN FOREIGN KEY LAGI, HANYA STRING BIASA
  total_amount  Int
  status        OrderStatus   @default(MENUNGGU_PICKUP)
  order_date    DateTime      @default(now())
  notes         String?       @db.Text

  // HAPUS BARIS INI: user User @relation(...)
  items         OrderItem[]
  payments      Payment[]
}

model OrderItem {
  id              String   @id @default(uuid())
  order_id        String
  service_id      Int      // INI BUKAN FOREIGN KEY LAGI, HANYA INT BIASA
  qty_or_weight   Decimal  @db.Decimal(8, 2)
  subtotal_price  Int

  order           Order    @relation(fields: [order_id], references: [id])
  // HAPUS BARIS INI: service Service @relation(...)
}

model Payment {
  id                String        @id @default(uuid())
  order_id          String
  amount            Int
  payment_method    String
  payment_proof_url String?
  status            PaymentStatus @default(PENDING)
  payment_date      DateTime      @default(now())

  order             Order         @relation(fields: [order_id], references: [id])
}
```
3. Sesuaikan `.env` dan jalankan `npx prisma db push`.

## 3. Modifikasi Controller (Sangat Penting!)
Pindahkan file `orderController.js`, `paymentController.js`, dan `analyticsController.js`. 
Namun, Anda harus **mencari dan menghapus semua query `include: { user: true }` atau `include: { service: true }`** karena prisma akan error mencarinya!

Sebagai gantinya, gunakan `axios` untuk meminta data dari service lain (API Call).

**Contoh 1: Mengambil daftar Order beserta nama Customer**
```javascript
// Di dalam orderController.js
const axios = require('axios');

exports.getAllOrders = async (req, res) => {
    try {
        // 1. Ambil data order dari database ini
        const orders = await prisma.order.findMany();

        // 2. Karena tabel User tidak ada di sini, kita Fetch dari User Service (Port 3001)
        const userResponse = await axios.get('http://localhost:3001/api/users');
        const users = userResponse.data; 

        // 3. Gabungkan datanya secara manual di Javascript
        const ordersWithUser = orders.map(order => {
            const user = users.find(u => u.id === order.user_id);
            return {
                ...order,
                user_name: user ? user.name : 'Unknown User'
            };
        });

        res.json(ordersWithUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
```

**Contoh 2: Validasi Harga saat Create Order**
```javascript
// Saat membuat order baru
// Jangan langsung percaya harga dari Frontend! Cek harga asli di Catalog Service.
const serviceResponse = await axios.get(`http://localhost:3002/api/services/${req.body.service_id}`);
const servicePrice = serviceResponse.data.price;
```

## 4. Pembuatan File Server (`index.js`)
Buat `src/index.js` dengan isi:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Daftarkan Routes
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
    console.log(`✅ Transaction Service berjalan di http://localhost:${PORT}`);
});
```

## 5. Pengujian
Jalankan `npm run dev` pada port 3003. Pastikan tidak ada *crash* dan silakan uji endpoint Order Anda menggunakan Postman.
