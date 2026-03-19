import { faker } from "@faker-js/faker";

import { defineCourseFactory } from "@/generated/fabbrica";

export const CourseFactory = defineCourseFactory({
  defaultData: async () => {
    const title = faker.lorem.words({ max: 5, min: 2 });

    return {
      description: faker.lorem.sentences({ max: 2, min: 1 }),
      id: faker.string.uuid(),
      outcomes: faker.lorem.sentence(),
      slug: faker.helpers.slugify(title).toLowerCase(),
      title,
    };
  },
});
