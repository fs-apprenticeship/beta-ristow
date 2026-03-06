import { faker } from "@faker-js/faker";

import { defineLessonFactory } from "@/generated/fabbrica";
import { CourseFactory } from "@/test/factories/course-factory";

export const LessonFactory = defineLessonFactory({
  defaultData: async () => {
    const title = faker.lorem.words({ max: 5, min: 2 });

    return {
      course: CourseFactory,
      id: faker.string.uuid(),
      slug: faker.helpers.slugify(title).toLowerCase(),
      title,
    };
  },
});
