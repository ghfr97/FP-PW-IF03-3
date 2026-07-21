const prisma = require('../utils/prisma');
const cloudinary = require('../utils/cloudinary');

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
        let image_url = null;
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'snowwash/services' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            image_url = uploadResult.secure_url;
        }

        const serviceData = {
            ...req.body,
            price: Number(req.body.price) // Ensure price is a number
        };
        if (image_url) {
            serviceData.image_url = image_url;
        }

        const service = await prisma.service.create({ data: serviceData });
        res.status(201).json({ message: 'Layanan ditambahkan', service });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceId = Number(id);

        let image_url = null;
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'snowwash/services' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            image_url = uploadResult.secure_url;
        }

        const serviceData = { ...req.body };
        if (serviceData.price !== undefined) {
            serviceData.price = Number(serviceData.price);
        }
        if (image_url) {
            serviceData.image_url = image_url;
        }

        const updatedService = await prisma.service.update({
            where: { id: serviceId },
            data: serviceData
        });

        res.json({ message: 'Layanan berhasil diupdate', service: updatedService });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        }
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedId = parseInt(id);
        
        await prisma.service.delete({
            where: { id: parsedId }
        });
        
        res.json({ message: 'Layanan berhasil dihapus permanen' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus layanan', error: error.message });
    }
};

exports.getAllServicesAdmin = async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

exports.toggleServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedService = await prisma.service.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        
        res.json({ message: `Layanan berhasil diubah menjadi ${status}`, service: updatedService });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengubah status layanan', error: error.message });
    }
};
