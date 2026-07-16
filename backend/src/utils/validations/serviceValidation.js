const { z } = require('zod');

const createServiceSchema = z.object({
  name: z.string().min(1, 'Nama layanan wajib diisi'),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().int().positive('Harga harus berupa angka positif')),
  unit: z.string().min(1, 'Unit wajib diisi (misal: /kg, /pcs)')
});

const updateServiceSchema = z.object({
  name: z.string().min(1, 'Nama layanan tidak boleh kosong').optional(),
  description: z.string().optional(),
  price: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().int().positive('Harga harus berupa angka positif').optional()),
  unit: z.string().min(1, 'Unit tidak boleh kosong').optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

module.exports = {
  createServiceSchema,
  updateServiceSchema
};
