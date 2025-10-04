import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'ADMIN' },
      { name: 'MANAGER' },
      { name: 'EMPLOYEE' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log('Roles seeded'))
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
