import getClient from "../src/lib/prisma/get-client";

const prisma = getClient();

async function main() {
  /*
   * NOTE: this is sort of a placeholder until we have data that we actually
   * need to seed; for now, it's just demonstrating the pattern. It should be
   * removed wheen proper data is added.
   */
  await prisma.account.create({ data: {} });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
