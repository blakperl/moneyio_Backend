import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "admin" },
      { name: "user" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Roles seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
