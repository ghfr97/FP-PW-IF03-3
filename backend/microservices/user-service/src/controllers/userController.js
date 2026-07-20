const prisma = require('../utils/prisma');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { created_at: 'desc' },
            select: { id: true, name: true, email: true, phone: true, address: true, role: true, avatar_url: true, created_at: true }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Gagal mengambil data seluruh user' });
    }
};

const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, address, role } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar!' });
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, phone, address, role: role || 'CUSTOMER' }
        });
        res.status(201).json({ message: 'User berhasil ditambahkan', user });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambah user', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        
        const user = await prisma.user.update({
            where: { id },
            data: { name, email, phone, address }
        });
        res.json({ message: 'User berhasil diperbarui', user });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus user', error: error.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await prisma.user.findMany({
            where: { role: 'CUSTOMER' },
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
