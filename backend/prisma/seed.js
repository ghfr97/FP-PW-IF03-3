const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  // 1. Buat Akun Admin Default
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@snowwash.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@snowwash.com',
      password: hashedPassword,
      phone: '081234567890',
      address: 'Pusat Operasional Snowwash',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin berhasil dibuat (admin@snowwash.com / admin123)');

  // 2. Buat Layanan Default (Berdasarkan mock data frontend)
  const services = [
    { name: 'Cuci Pakaian', description: 'Detergen premium, front-load', price: 6000, unit: '/kg' },
    { name: 'Setrika Pakaian', description: 'Setrika uap, rapi sempurna', price: 4000, unit: '/kg' },
    { name: 'Cuci + Setrika', description: 'Paket lengkap hemat', price: 9000, unit: '/kg' },
    { name: 'Express Laundry', description: 'Prioritas antrian, 3 jam', price: 15000, unit: '/kg' }
  ];

  for (const s of services) {
    await prisma.service.create({
      data: s
    });
  }
  console.log('✅ Layanan dasar berhasil ditambahkan');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
