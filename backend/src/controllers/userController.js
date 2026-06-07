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
