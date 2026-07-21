const prisma = require('../utils/prisma');

exports.getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { is_read: false },
            orderBy: { created_at: 'desc' },
            take: 20
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil notifikasi', error: error.message });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        const notification = await prisma.notification.create({
            data: { message }
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat notifikasi', error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { is_read: true }
        });
        res.json({ message: 'Notifikasi ditandai sudah dibaca' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menandai notifikasi', error: error.message });
    }
};
