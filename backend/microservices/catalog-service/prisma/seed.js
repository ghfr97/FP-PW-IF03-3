const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding Catalog Database...');
  
  const services = [
    { name: 'Cuci Pakaian', description: 'Detergen premium, front-load', price: 6000, unit: '/kg' },
    { name: 'Setrika Pakaian', description: 'Setrika uap, rapi sempurna', price: 4000, unit: '/kg' },
    { name: 'Cuci + Setrika', description: 'Paket lengkap hemat', price: 9000, unit: '/kg' },
    { name: 'Express Laundry', description: 'Prioritas antrian, 3 jam', price: 15000, unit: '/kg' }
  ];

  for (const s of services) {
    // Check if exists
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if(!existing) {
        await prisma.service.create({
          data: s
        });
    }
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
