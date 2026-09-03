import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constans";

async function main() {
  const password = await bcrypt.hash("Test@123456", 12);

  const users = await prisma.user.createMany({
    data: [
      {
        email: "admin1@test.com",
        password,
        role: ROLES.ADMIN,
      },
      {
        email: "admin2@test.com",
        password,
        role: ROLES.ADMIN,
      },
    ],
  });
  console.log("Admin created:", users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
