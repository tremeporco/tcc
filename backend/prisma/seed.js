import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar planos padrão
  await prisma.plan.createMany({
    data: [
      { name: 'Free', price: 0, maxLinks: 10, maxClicks: 100 },
      { name: 'Basic', price: 9.90, maxLinks: 100, maxClicks: 1000 },
      { name: 'Pro', price: 19.90, maxLinks: -1, maxClicks: -1 },
    ],
    skipDuplicates: true,
  });

  console.log('Planos criados com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());