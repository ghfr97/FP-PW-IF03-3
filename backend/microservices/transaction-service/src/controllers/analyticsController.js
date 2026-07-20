const prisma = require('../utils/prisma');
const axios = require('axios');

exports.getDashboardStats = async (req, res) => {
    try {
        const userRes = await axios.get(`${process.env.USER_SERVICE_URL}/api/users`, {
            headers: { Authorization: req.headers.authorization }
        });
        const users = userRes.data;
        const totalUsers = users.filter(u => u.role === 'CUSTOMER').length;
        
        const totalOrders = await prisma.order.count();
        const pendingOrders = await prisma.order.count({ where: { status: 'MENUNGGU_PICKUP' } });
        
        const sumTotal = await prisma.order.aggregate({
            _sum: { total_amount: true },
            where: { status: 'SELESAI' }
        });
        
        // Manual calculate top customers
        const orders = await prisma.order.findMany();
        let avgAmount = 0;
        if(orders.length > 0) {
            avgAmount = orders.reduce((sum, o) => sum + o.total_amount, 0) / orders.length;
        }
        
        const topUserIds = new Set(orders.filter(o => o.total_amount > avgAmount).map(o => o.user_id));
        const topCustomers = users.filter(u => topUserIds.has(u.id)).map(u => ({
            name: u.name,
            email: u.email
        }));
        
        res.json({
            total_users: totalUsers,
            total_orders: totalOrders,
            pending_orders: pendingOrders,
            total_revenue: sumTotal._sum.total_amount || 0,
            top_customers: topCustomers
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memuat analitik', error: error.message });
    }
};
