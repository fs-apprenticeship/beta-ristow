import { initialize } from "../src/generated/fabbrica";
import getClient from "../src/lib/prisma/get-client";
import { AccountFactory } from "../src/test/factories/account-factory";
import { CourseFactory } from "../src/test/factories/course-factory";

const prisma = getClient();
initialize({ prisma });

async function main() {
  /*
   * NOTE: this is sort of a placeholder until we have data that we actually
   * need to seed; for now, it's just demonstrating the pattern. It should be
   * removed wheen proper data is added.
   */
  const accountId = "8c6c41b0-0c3a-4c84-8a5b-06c8e5b0d15a";
  const accountData = await AccountFactory.build({ id: accountId });

  await prisma.account.upsert({
    create: accountData,
    update: {},
    where: { id: accountId },
  });

  const courseData = await CourseFactory.build({
    slug: "intro-to-python",
    title: "Intro to Python",
  });

  await prisma.course.upsert({
    create: courseData,
    update: {
      title: courseData.title,
    },
    where: { slug: courseData.slug },
  });
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
