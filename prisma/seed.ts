import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Colour T-Shirt' },
    { name: 'Rounded T-Shirt' },
    { name: 'Hoodie' },
    { name: 'Sweat Shirt' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
}

main()
  .then(() => console.log('Seed completed!'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
