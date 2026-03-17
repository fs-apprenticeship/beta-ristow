import { faker } from "@faker-js/faker";

import { defineLessonItemFactory } from "@/generated/fabbrica";
import { AccountFactory } from "@/test/factories/account-factory";
import { LessonFactory } from "@/test/factories/lesson-factory";

export const LessonItemFactory = defineLessonItemFactory({
  defaultData: async () => {
    return {
      completedAt: null,
      id: faker.string.uuid(),
      learner: AccountFactory,
      lesson: LessonFactory,
      position: faker.number.int({ max: 100, min: 1 }),
      title: faker.lorem.words({ max: 5, min: 2 }),
    };
  },
});
