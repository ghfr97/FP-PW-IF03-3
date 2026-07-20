const multer = require('multer');

// Gunakan memoryStorage agar file disimpan di buffer RAM sementara sebelum diupload ke Cloudinary
const storage = multer.memoryStorage();

// Inisialisasi multer
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit ukuran file 5MB
  },
  fileFilter: (req, file, cb) => {
    // Validasi tipe file (hanya gambar)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
  }
});

module.exports = upload;
