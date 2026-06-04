const prisma = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');

exports.createOrder = async (req, res) => {
    try {
        const { items, notes } = req.body; // items = [{ service_id: 1, qty: 2 }]
        
        let total_amount = 0;
        const orderItemsData = [];
        
        for (const item of items) {
            const service = await prisma.service.findUnique({ where: { id: item.service_id } });
            if (service) {
                const subtotal = service.price * item.qty;
                total_amount += subtotal;
                orderItemsData.push({
                    service_id: service.id,
                    qty_or_weight: item.qty,
                    subtotal_price: subtotal
                });
            }
        }
        
        const order_id = 'ORD-' + uuidv4().substring(0, 8).toUpperCase();
        
        const order = await prisma.order.create({
            data: {
                id: order_id,
                user_id: req.userId,
                total_amount,
                notes,
                items: {
                    create: orderItemsData
                }
            },
            include: { items: true }
        });
        
        res.status(201).json({ message: 'Pesanan berhasil dibuat', order });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat pesanan', error: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { user_id: req.userId },
            include: { items: { include: { service: true } } },
            orderBy: { order_date: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: { include: { service: true } } },
            orderBy: { order_date: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        });
        res.json({ message: 'Status diupdate', updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Gagal update status' });
    }
};
