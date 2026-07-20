const { z } = require('zod');

const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      service_id: z.number().int().positive('Invalid service ID'),
      qty: z.number().int().positive('Quantity must be at least 1')
    })).min(1, 'Order must contain at least one item'),
    notes: z.string().optional(),
    payment_method: z.string().optional()
  })
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.string().min(1, 'Status is required')
  }),
  params: z.object({
    id: z.string().min(1, 'Order ID is required')
  })
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
