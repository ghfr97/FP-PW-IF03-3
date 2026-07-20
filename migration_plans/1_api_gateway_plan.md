# Panduan Eksekusi: API Gateway

Dokumen ini adalah panduan teknis (Step-by-Step) untuk men-setup API Gateway. API Gateway akan bertindak sebagai "pintu masuk" tunggal untuk Frontend, yang kemudian akan meneruskan (*proxy/routing*) permintaan tersebut ke masing-masing Microservice yang berjalan di _port_ berbeda.

## 1. Persiapan Folder & Dependencies
1. Buat folder baru di proyek Anda, misalnya `backend/microservices/api-gateway`.
2. Buka terminal di folder tersebut dan jalankan:
   ```bash
   npm init -y
   npm install express cors express-http-proxy dotenv morgan
   npm install --save-dev nodemon
   ```

## 2. Pembuatan File Server (`index.js`)
Buat file `index.js` di dalam folder `api-gateway` dan salin kode berikut. Kode ini akan meneruskan (_proxy_) setiap permintaan URL ke port microservice yang benar.

```javascript
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev')); // Untuk melihat log request di terminal

// --- DAFTAR MICROSERVICES URL ---
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3002';
const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003';

// --- ROUTING (PROXY) ---
// 1. User Service (Mengurus Auth dan User)
app.use('/api/auth', proxy(USER_SERVICE_URL, { proxyReqPathResolver: req => '/api/auth' + req.url }));
app.use('/api/users', proxy(USER_SERVICE_URL, { proxyReqPathResolver: req => '/api/users' + req.url }));

// 2. Catalog Service (Mengurus master data jasa laundry)
app.use('/api/services', proxy(CATALOG_SERVICE_URL, { proxyReqPathResolver: req => '/api/services' + req.url }));

// 3. Transaction Service (Mengurus Order, Payment, Analytics)
app.use('/api/orders', proxy(TRANSACTION_SERVICE_URL, { proxyReqPathResolver: req => '/api/orders' + req.url }));
app.use('/api/payments', proxy(TRANSACTION_SERVICE_URL, { proxyReqPathResolver: req => '/api/payments' + req.url }));
app.use('/api/analytics', proxy(TRANSACTION_SERVICE_URL, { proxyReqPathResolver: req => '/api/analytics' + req.url }));

// Fallback Route
app.use('/', (req, res) => {
    res.json({ message: 'Snowwash API Gateway Berjalan dengan Baik!' });
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway berjalan di http://localhost:${PORT}`);
});
```

## 3. Tambahkan Script di `package.json`
Buka `package.json` di dalam folder `api-gateway` dan tambahkan script ini:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

## 4. Cara Pengujian
1. Pastikan semua microservices lainnya sudah berjalan nanti.
2. Jalankan API gateway dengan `npm run dev`.
3. Coba panggil Endpoint lewat gateway, misalnya: `GET http://localhost:5000/api/services`. Gateway harusnya sukses mengembalikan data dari Catalog Service.
