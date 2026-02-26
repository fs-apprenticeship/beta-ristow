import { faker } from "@faker-js/faker";

import getClient from "@/lib/prisma/get-client";
import { defineAccountFactory } from "@/prisma-generated/factories";

const prisma = getClient();

const accountFactory = defineAccountFactory(prisma).props({
  id: () => faker.string.uuid(),
});

export default accountFactory;
