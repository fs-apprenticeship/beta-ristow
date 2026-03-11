import { auth } from "@clerk/nextjs/server";

export default async function getCurrentUserId() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return userId;
}
