import Link from "next/link";

import countAccounts from "@/features/identity/actions/count-accounts";
import getCurrentAccount from "@/features/identity/actions/get-current-account";
import getCourses from "@/features/learning/get-all-courses";

export const dynamic = "force-dynamic";

export default async function Home() {
  const account = await getCurrentAccount();
  if (!account) {
    return (
      <main>
        <h1>Hello, world.</h1>
        <p>Please sign in to see the number of accounts.</p>
      </main>
    );
  }

  const count = await countAccounts();
  const courses = await getCourses();

  return (
    <main>
      <h1>Hello, world.</h1>
      <p>There are {count} account(s).</p>

      <h2>Courses</h2>
      {courses.map((course) => (
        <div key={course.id}>
          <Link href={`/courses/${course.slug}`}>{course.title}</Link>
        </div>
      ))}
    </main>
  );
}
