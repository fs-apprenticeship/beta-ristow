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

  const courseTemplate = {
    description:
      "Learn the Python fundamentals you need to read code, write small programs, and build confidence through practice.",
    outcomes:
      "You will be able to write simple Python scripts, work with core language features, and keep learning independently.",
    slug: "intro-to-python",
    title: "Intro to Python",
  };

  const courseData = await CourseFactory.build({
    description: courseTemplate.description,
    outcomes: courseTemplate.outcomes,
    slug: courseTemplate.slug,
    title: courseTemplate.title,
  });

  await prisma.course.upsert({
    create: courseData,
    update: {
      description: courseData.description,
      outcomes: courseData.outcomes,
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

  const lessonTemplates = [
    {
      description:
        "Install Python, choose an editor, and verify that you can run code from your machine.",
      outcomes:
        "You will have a working Python setup and know how to run your first script.",
      position: 1,
      title: "Set Up Your Environment",
    },
    {
      description:
        "Get comfortable with Python values, variable assignment, and the basic built-in data types you will use constantly.",
      outcomes:
        "You will be able to store data in variables and choose the right basic type for simple problems.",
      position: 2,
      title: "Variables and Types",
    },
    {
      description:
        "Write reusable code with functions, pass inputs into them, and understand the values they return.",
      outcomes:
        "You will be able to define and call functions to organize repeated logic.",
      position: 3,
      title: "First Functions",
    },
  ];

  for (const lessonTemplate of lessonTemplates) {
    const lessonData = await LessonFactory.build({
      course: { connect: { id: course.id } },
      description: lessonTemplate.description,
      outcomes: lessonTemplate.outcomes,
      position: lessonTemplate.position,
      slug: faker.helpers.slugify(lessonTemplate.title).toLowerCase(),
      title: lessonTemplate.title,
    });

    const seededLesson = await prisma.lesson.upsert({
      create: lessonData,
      update: {
        description: lessonData.description,
        outcomes: lessonData.outcomes,
        position: lessonData.position,
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
      const itemTitle = `${seededLesson.title} - Item ${i + 1}`;

      const itemData = await LessonItemFactory.build({
        learner: { connect: { id: accountId } },
        lesson: { connect: { id: seededLesson.id } },
        position: i + 1,
        title: itemTitle,
      });

      await prisma.lessonItem.upsert({
        create: itemData,
        update: {
          title: itemData.title,
        },
        where: {
          lessonId_learnerId_position: {
            learnerId: accountId,
            lessonId: seededLesson.id,
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
