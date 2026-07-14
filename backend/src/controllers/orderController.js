const prisma = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');
const midtransClient = require('midtrans-client');

// Midtrans Core API initialization
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createOrder = async (req, res) => {
    // This is the old basic create order, kept for backward compatibility if needed, 
    // but we will mainly use createOrderAndPayment going forward.
    // ...
};

exports.createOrderAndPayment = async (req, res) => {
    try {
        const { items, notes, payment_method } = req.body;
        
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
        
        // Menggunakan transaction untuk memastikan atomic (Order, OrderItem, dan Payment dibuat sekaligus)
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    id: order_id,
                    user_id: req.userId,
                    total_amount,
                    notes,
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: true, user: true }
            });

            await tx.payment.create({
                data: {
                    order_id: newOrder.id,
                    amount: total_amount,
                    payment_method: payment_method || 'TRANSFER',
                    status: payment_method === 'COD' ? 'PENDING' : 'PENDING'
                }
            });

            return newOrder;
        });

        // Jika metode COD, kita tidak perlu memanggil Midtrans
        if (payment_method === 'COD') {
            return res.status(201).json({ message: 'Pesanan COD berhasil dibuat', order });
        }

        // Jika metode TRANSFER, buat Snap Token dari Midtrans
        const parameter = {
            transaction_details: {
                order_id: order.id,
                gross_amount: order.total_amount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: order.user.name,
                email: order.user.email,
                phone: order.user.phone
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;

        res.status(201).json({ 
            message: 'Pesanan berhasil dibuat, silakan proses pembayaran', 
            order, 
            token: transactionToken 
        });

    } catch (error) {
        console.error("Error createOrderAndPayment:", error);
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

// --- MINGGU 13: VIEW ---
// Memanggil View UserOrderSummaryView menggunakan raw query
exports.getUserOrderSummary = async (req, res) => {
    try {
        const summary = await prisma.$queryRaw`SELECT * FROM UserOrderSummaryView`;
        // Prisma mengembalikan BigInt untuk fungsi agregasi (COUNT/SUM) di MySQL, kita konversi agar bisa di-stringify ke JSON
        const formattedSummary = summary.map(item => ({
            ...item,
            total_orders: Number(item.total_orders),
            total_spent: Number(item.total_spent)
        }));
        res.json({ message: 'Berhasil mengambil view', data: formattedSummary });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memanggil view', error: error.message });
    }
};

// --- MINGGU 10: STORED PROCEDURE ---
// Memanggil Stored Procedure ApplyDiscountToAllOrders
exports.applyDiscount = async (req, res) => {
    try {
        await prisma.$executeRaw`CALL ApplyDiscountToAllOrders()`;
        res.json({ message: 'Stored Procedure berhasil dieksekusi, diskon telah diterapkan jika memenuhi syarat.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengeksekusi stored procedure', error: error.message });
    }
};

