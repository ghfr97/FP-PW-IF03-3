const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Tidak ada token, akses ditolak!' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_access_key_123');
        req.userId = decoded.id;
        
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user) return res.status(401).json({ message: 'User tidak ditemukan' });
        
        req.userRole = user.role;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.userRole !== 'ADMIN') {
        return res.status(403).json({ message: 'Akses ditolak, khusus Admin!' });
    }
    next();
};

module.exports = { verifyToken, requireAdmin };
