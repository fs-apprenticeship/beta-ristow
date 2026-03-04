import { initialize } from "../src/generated/fabbrica";
import getClient from "../src/lib/prisma/get-client";
import { AccountFactory } from "../src/test/factories/account-factory";

const prisma = getClient();
initialize({ prisma });

async function main() {
  /*
   * NOTE: this is sort of a placeholder until we have data that we actually
   * need to seed; for now, it's just demonstrating the pattern. It should be
   * removed wheen proper data is added.
   */
  await AccountFactory.create();
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
