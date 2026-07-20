const express = require('express');
const cors = require('cors');
require('dotenv').config();

const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Untuk serve file statis upload (jika ada)
app.use('/uploads', express.static('uploads'));

// Daftarkan Routes
app.use('/api/services', serviceRoutes);

app.listen(PORT, () => {
    console.log(`✅ Catalog Service berjalan di http://localhost:${PORT}`);
});
