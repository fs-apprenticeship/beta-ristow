import { faker } from "@faker-js/faker";

import { defineOnboardingQuestionTemplateFactory } from "@/generated/fabbrica";
import { CourseFactory } from "@/test/factories/course-factory";

export const OnboardingQuestionTemplateFactory =
  defineOnboardingQuestionTemplateFactory({
    defaultData: async () => ({
      course: CourseFactory,
      description: faker.lorem.sentences({ max: 2, min: 1 }),
      id: faker.string.uuid(),
      position: faker.number.int({ max: 10, min: 1 }),
      question: `${faker.hacker.phrase()}?`,
    }),
  });
