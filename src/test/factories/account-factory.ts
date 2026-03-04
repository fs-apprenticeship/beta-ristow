import { faker } from "@faker-js/faker";

import { defineAccountFactory } from "@/generated/fabbrica";

export const AccountFactory = defineAccountFactory({
  defaultData: async () => ({
    id: faker.string.uuid(),
  }),
});
