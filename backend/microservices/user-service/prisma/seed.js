const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding User Database...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
