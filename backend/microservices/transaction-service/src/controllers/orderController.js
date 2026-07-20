const prisma = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');
const midtransClient = require('midtrans-client');
const axios = require('axios');

// Midtrans Core API initialization
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createOrder = async (req, res) => {
    res.status(400).json({ message: "Deprecated" });
};

exports.createOrderAndPayment = async (req, res) => {
    try {
        const { items, notes, payment_method } = req.body;
        
        let total_amount = 0;
        const orderItemsData = [];
        
        const serviceResponse = await axios.get(`${process.env.CATALOG_SERVICE_URL}/api/services`);
        const services = serviceResponse.data;
        
        for (const item of items) {
            const service = services.find(s => s.id === item.service_id);
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
                include: { items: true }
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

        if (payment_method === 'COD') {
            return res.status(201).json({ message: 'Pesanan COD berhasil dibuat', order });
        }

        const userRes = await axios.get(`${process.env.USER_SERVICE_URL}/api/users`, {
            headers: { Authorization: req.headers.authorization }
        });
        const users = userRes.data;
        const user = users.find(u => u.id === req.userId);

        const parameter = {
            transaction_details: {
                order_id: order.id,
                gross_amount: order.total_amount
            },
            credit_card: { secure: true },
            customer_details: {
                first_name: user ? user.name : 'Customer',
                email: user ? user.email : 'customer@snowwash.com',
                phone: user ? user.phone : '000000000'
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
            include: { items: true },
            orderBy: { order_date: 'desc' }
        });
        
        const serviceResponse = await axios.get(`${process.env.CATALOG_SERVICE_URL}/api/services`);
        const services = serviceResponse.data;
        
        const ordersWithServices = orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
                ...item,
                service: services.find(s => s.id === item.service_id) || null
            }))
        }));
        
        res.json(ordersWithServices);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { order_date: 'desc' }
        });
        
        const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/users`, {
            headers: { Authorization: req.headers.authorization }
        });
        const users = userResponse.data;
        
        const serviceResponse = await axios.get(`${process.env.CATALOG_SERVICE_URL}/api/services`);
        const services = serviceResponse.data;
        
        const finalOrders = orders.map(order => ({
            ...order,
            user: users.find(u => u.id === order.user_id) || null,
            items: order.items.map(item => ({
                ...item,
                service: services.find(s => s.id === item.service_id) || null
            }))
        }));
        
        res.json(finalOrders);
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

exports.getUserOrderSummary = async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/users`, {
             headers: { Authorization: req.headers.authorization }
        });
        const users = userResponse.data;
        
        const summaryMap = {};
        for(const order of orders) {
            if(!summaryMap[order.user_id]) {
                summaryMap[order.user_id] = { user_id: order.user_id, total_orders: 0, total_spent: 0 };
            }
            summaryMap[order.user_id].total_orders += 1;
            summaryMap[order.user_id].total_spent += order.total_amount;
        }
        
        const formattedSummary = Object.values(summaryMap).map(item => {
            const user = users.find(u => u.id === item.user_id);
            return {
                user_id: item.user_id,
                name: user ? user.name : 'Unknown User',
                total_orders: item.total_orders,
                total_spent: item.total_spent
            };
        });
        
        res.json({ message: 'Berhasil mengambil summary', data: formattedSummary });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memanggil summary', error: error.message });
    }
};

exports.applyDiscount = async (req, res) => {
    res.json({ message: 'Stored Procedure tidak berlaku di arsitektur microservice.' });
};
