import { prisma } from "@/lib/prisma";

async function main() {
  const users = await prisma.user.deleteMany({
  where: {
    email: {
      in: [
        "aksachan21@gmail.com",
        "s3@test.com",
        "admin@test.com"
      ],
    },
  },
});
  console.log("User deleted:", users);
}


main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
