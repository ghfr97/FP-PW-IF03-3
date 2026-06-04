const prisma = require('../utils/prisma');

exports.getAllServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({ where: { status: 'ACTIVE' } });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

exports.createService = async (req, res) => {
    try {
        const service = await prisma.service.create({ data: req.body });
        res.status(201).json({ message: 'Layanan ditambahkan', service });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};
