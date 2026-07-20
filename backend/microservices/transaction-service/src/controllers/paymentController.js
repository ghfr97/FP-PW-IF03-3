const midtransClient = require('midtrans-client');
const prisma = require('../utils/prisma');

const apiClient = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.handleMidtransNotification = async (req, res) => {
    try {
        const notificationJson = req.body;
        const statusResponse = await apiClient.transaction.notification(notificationJson);
        
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        
        console.log(`Notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // Cari transaksi Payment yang sesuai dengan order_id
        const payment = await prisma.payment.findFirst({
            where: { order_id: orderId }
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        let paymentStatus = payment.status;
        let orderStatus = null; // Opsional: update order status juga

        if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
                paymentStatus = 'PENDING';
            } else if (fraudStatus === 'accept') {
                paymentStatus = 'VERIFIED';
                orderStatus = 'DIJEMPUT';
            }
        } else if (transactionStatus === 'settlement') {
            paymentStatus = 'VERIFIED';
            orderStatus = 'DIJEMPUT';
        } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
            paymentStatus = 'FAILED';
            orderStatus = 'BATAL';
        } else if (transactionStatus === 'pending') {
            paymentStatus = 'PENDING';
        }

        // Update database (Gunakan transaction agar atomic)
        await prisma.$transaction(async (tx) => {
            // Update Payment Status
            await tx.payment.update({
                where: { id: payment.id },
                data: { status: paymentStatus }
            });

            // Update Order Status if necessary
            if (orderStatus) {
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: orderStatus }
                });
            }
        });

        res.status(200).json({ status: 'success', message: 'OK' });
    } catch (error) {
        console.error("Error midtrans webhook:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
