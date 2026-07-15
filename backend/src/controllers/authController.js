const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_access_key_123';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_456';

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar!' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, phone }
        });
        
        res.status(201).json({ message: 'Registrasi berhasil', data: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Email atau password salah!' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Email atau password salah!' });
        
        const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
        
        await prisma.user.update({
            where: { id: user.id },
            data: { refresh_token: refreshToken }
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
        });
        
        res.json({ message: 'Login berhasil', accessToken, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token tidak ditemukan!' });
        
        const user = await prisma.user.findFirst({ where: { refresh_token: refreshToken } });
        if (!user) return res.status(403).json({ message: 'Refresh token tidak valid!' });
        
        jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Refresh token kedaluwarsa atau tidak valid!' });
            
            const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, phone: true, address: true, created_at: true, role: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            await prisma.user.updateMany({
                where: { refresh_token: refreshToken },
                data: { refresh_token: null }
            });
        }
        res.clearCookie('refreshToken');
        res.json({ message: 'Logout berhasil' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat logout', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        
        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { name, phone, address },
            select: { id: true, name: true, email: true, phone: true, address: true, role: true, created_at: true }
        });
        
        res.json({ message: 'Profil berhasil diperbarui', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui profil', error: error.message });
    }
};
