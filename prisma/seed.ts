import { faker } from "@faker-js/faker";

import { initialize } from "../src/generated/fabbrica";
import getClient from "../src/lib/prisma/get-client";
import { AccountFactory } from "../src/test/factories/account-factory";
import { CourseFactory } from "../src/test/factories/course-factory";
import { LessonFactory } from "../src/test/factories/lesson-factory";
import { LessonItemFactory } from "../src/test/factories/lesson-item-factory";
import { OnboardingQuestionTemplateFactory } from "../src/test/factories/onboarding-question-template-factory";

const prisma = getClient();
initialize({ prisma });

async function main() {
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

  const course = await prisma.course.findUnique({
    select: { id: true },
    where: { slug: courseData.slug },
  });

  if (!course) {
    throw new Error("Seed course not found after upsert.");
  }

  const onboardingQuestionTemplates = [
    {
      description:
        "A sentence or two is plenty. If it helps, mention what you have studied before or where things usually start to feel confusing.",
      position: 1,
      question: "Describe your current experience with Python.",
    },
    {
      description:
        'Focus on outcomes, not credentials. What would "this was worth it" look like?',
      position: 2,
      question: "What are you hoping to achieve after learning Python?",
    },
  ];

  for (const template of onboardingQuestionTemplates) {
    const templateData = await OnboardingQuestionTemplateFactory.build({
      course: { connect: { id: course.id } },
      description: template.description,
      position: template.position,
      question: template.question,
    });

    await prisma.onboardingQuestionTemplate.upsert({
      create: templateData,
      update: {
        description: templateData.description,
        question: templateData.question,
      },
      where: {
        courseId_position: {
          courseId: course.id,
          position: templateData.position,
        },
      },
    });
  }

  const lessonTitles = [
    "Set Up Your Environment",
    "Variables and Types",
    "First Functions",
  ];

  for (const title of lessonTitles) {
    const lessonData = await LessonFactory.build({
      course: { connect: { id: course.id } },
      slug: faker.helpers.slugify(title).toLowerCase(),
      title,
    });

    const lesson = await prisma.lesson.upsert({
      create: lessonData,
      update: {
        title: lessonData.title,
      },
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: lessonData.slug,
        },
      },
    });

    const numberOfItems = 3;

    for (let i = 0; i < numberOfItems; i++) {
      const itemData = await LessonItemFactory.build({
        learner: { connect: { id: accountId } },
        lesson: { connect: { id: lesson.id } },
        position: i + 1,
        title: `${title} - Item ${i + 1}`,
      });

      await prisma.lessonItem.upsert({
        create: itemData,
        update: {
          title: itemData.title,
        },
        where: {
          lessonId_learnerId_position: {
            learnerId: accountId,
            lessonId: lesson.id,
            position: itemData.position,
          },
        },
      });
    }
  }
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
