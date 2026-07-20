const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    phone: z.string().min(1, 'Phone is required').optional(),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    phone: z.string().min(1, 'Phone is required').optional(),
    address: z.string().min(1, 'Address is required').optional(),
  })
});

module.exports = { registerSchema, loginSchema, updateProfileSchema };
