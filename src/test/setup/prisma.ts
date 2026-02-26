import { PrismaTestingHelper } from "@chax-at/transactional-prisma-testing";
import { PrismaPg } from "@prisma/adapter-pg";
import { afterEach, beforeEach } from "vitest";

import { PrismaClient } from "@/prisma-generated/client";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaTestingHelper: PrismaTestingHelper<PrismaClient> | undefined;
}

if (!global.prismaTestingHelper) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  global.prismaTestingHelper = new PrismaTestingHelper(prisma);
}

const prismaTestingHelper = global.prismaTestingHelper;
global.prisma = prismaTestingHelper.getProxyClient();

beforeEach(async () => await prismaTestingHelper.startNewTransaction());
afterEach(() => prismaTestingHelper.rollbackCurrentTransaction());
