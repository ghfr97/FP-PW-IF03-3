const prisma = require('../utils/prisma');

exports.getCustomers = async (req, res) => {
    try {
        const customers = await prisma.user.findMany({
            where: { role: 'CUSTOMER' },
            include: {
                orders: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Gagal mengambil data pelanggan' });
    }
};

const cloudinary = require('../utils/cloudinary');

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah' });
        }

        // Upload ke Cloudinary menggunakan stream karena file ada di memory (buffer)
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'snowwash_avatars' },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ message: 'Gagal mengunggah gambar ke Cloudinary', error: error.message });
                }

                try {
                    // Update URL avatar di tabel User
                    const updatedUser = await prisma.user.update({
                        where: { id: req.userId }, // req.userId didapat dari authMiddleware
                        data: { avatar_url: result.secure_url },
                        select: { id: true, name: true, avatar_url: true }
                    });

                    res.json({
                        message: 'Foto profil berhasil diperbarui',
                        user: updatedUser
                    });
                } catch (dbError) {
                    res.status(500).json({ message: 'Gagal menyimpan URL gambar ke database', error: dbError.message });
                }
            }
        );

        // Menyalurkan buffer ke stream upload
        uploadStream.end(req.file.buffer);

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan internal server', error: error.message });
    }
};
