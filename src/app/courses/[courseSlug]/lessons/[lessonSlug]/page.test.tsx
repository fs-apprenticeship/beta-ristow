import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CourseFactory } from "@/test/factories/course-factory";
import { LessonFactory } from "@/test/factories/lesson-factory";

import LessonPage from "./page";

describe("Lesson page", () => {
  it("renders the course and lesson titles", async () => {
    const course = await CourseFactory.create();
    const lesson = await LessonFactory.create({
      course: { connect: { id: course.id } },
    });

    const page = await LessonPage({
      params: Promise.resolve({
        courseSlug: course.slug,
        lessonSlug: lesson.slug,
      }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: course.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: lesson.title }),
    ).toBeInTheDocument();
  });
});
