const prisma = require('../utils/prisma');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
        const totalOrders = await prisma.order.count();
        const pendingOrders = await prisma.order.count({ where: { status: 'MENUNGGU_PICKUP' } });
        
        const sumTotal = await prisma.order.aggregate({
            _sum: { total_amount: true },
            where: { status: 'SELESAI' }
        });
        
        // Subquery (Minggu 4): Mencari customer dengan total_amount > rata-rata semua order
        const topCustomers = await prisma.$queryRaw`
            SELECT DISTINCT u.name, u.email 
            FROM User u
            WHERE u.id IN (
                SELECT user_id 
                FROM \`Order\`
                WHERE total_amount > (SELECT AVG(total_amount) FROM \`Order\`)
            )
        `;
        
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
