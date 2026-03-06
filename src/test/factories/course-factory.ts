import { faker } from "@faker-js/faker";

import { defineCourseFactory } from "@/generated/fabbrica";

export const CourseFactory = defineCourseFactory({
  defaultData: async () => {
    const title = faker.lorem.words({ max: 5, min: 2 });

    return {
      id: faker.string.uuid(),
      slug: faker.helpers.slugify(title).toLowerCase(),
      title,
    };
  },
});
