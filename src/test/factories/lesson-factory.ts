import { faker } from "@faker-js/faker";

import { defineLessonFactory } from "@/generated/fabbrica";
import { CourseFactory } from "@/test/factories/course-factory";

export const LessonFactory = defineLessonFactory({
  defaultData: async ({ seq }) => {
    const title = faker.lorem.words({ max: 5, min: 2 });

    return {
      course: CourseFactory,
      description: faker.lorem.sentences({ max: 2, min: 1 }),
      id: faker.string.uuid(),
      outcomes: faker.lorem.sentence(),
      position: seq,
      slug: faker.helpers.slugify(title).toLowerCase(),
      title,
    };
  },
});
