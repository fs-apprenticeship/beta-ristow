import { faker } from "@faker-js/faker";

import { defineOnboardingQuestionFactory } from "@/generated/fabbrica";
import { OnboardingQuestionOrigin } from "@/lib/prisma/enums";
import { AccountFactory } from "@/test/factories/account-factory";
import { CourseFactory } from "@/test/factories/course-factory";

const { GENERATED, TEMPLATE } = OnboardingQuestionOrigin;

export const OnboardingQuestionFactory = defineOnboardingQuestionFactory({
  defaultData: async ({ seq }) => ({
    answer: null,
    course: CourseFactory,
    description: faker.lorem.sentences({ max: 2, min: 1 }),
    learner: AccountFactory,
    origin: TEMPLATE,
    position: seq,
    question: `${faker.company.catchPhrase()}?`,
  }),
  traits: {
    generated: {
      data: async () => ({
        description: "",
        origin: GENERATED,
        question: "",
      }),
    },
    template: {
      data: async () => ({
        origin: TEMPLATE,
      }),
    },
  },
});
