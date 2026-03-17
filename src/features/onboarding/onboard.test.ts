import { describe, expect, it } from "vitest";

import { OnboardingQuestionOrigin } from "@/lib/prisma/enums";
import getClient from "@/lib/prisma/get-client";
import { AccountFactory } from "@/test/factories/account-factory";
import { CourseFactory } from "@/test/factories/course-factory";
import { OnboardingQuestionFactory } from "@/test/factories/onboarding-question-factory";
import { OnboardingQuestionTemplateFactory } from "@/test/factories/onboarding-question-template-factory";

import onboard from "./onboard";

const { GENERATED, TEMPLATE } = OnboardingQuestionOrigin;

describe("onboard", () => {
  describe("with existing questions", async () => {
    it("does not add any new questions", async () => {
      const course = await CourseFactory.create();
      const learner = await AccountFactory.create();

      const existing = await OnboardingQuestionFactory.use("template").create({
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
      });

      await onboard(course.id, learner.id);

      const prisma = getClient();
      const created = await prisma.onboardingQuestion.findMany({
        where: { courseId: course.id, learnerId: learner.id },
      });

      expect(created).toHaveLength(1);
      expect(created[0]?.id).toBe(existing.id);
    });

    it("returns the first unanswered question and the question count", async () => {
      const course = await CourseFactory.create();
      const learner = await AccountFactory.create();

      await OnboardingQuestionFactory.create({
        answer: "Done",
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
        position: 1,
      });

      const unanswered = await OnboardingQuestionFactory.create({
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
        position: 2,
      });

      await OnboardingQuestionFactory.use("generated").create({
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
        position: 3,
      });

      const result = await onboard(course.id, learner.id);

      expect(result).toEqual({
        nextQuestion: {
          description: unanswered.description,
          id: unanswered.id,
          isGenerated: false,
          position: 2,
          question: unanswered.question,
        },
        questionCount: 3,
      });
    });

    it("returns null for the next question if all questions are answered", async () => {
      const course = await CourseFactory.create();
      const learner = await AccountFactory.create();

      await OnboardingQuestionFactory.use("template").create({
        answer: "Done",
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
      });

      const result = await onboard(course.id, learner.id);

      expect(result).toEqual({
        nextQuestion: null,
        questionCount: 1,
      });
    });
  });

  describe("without existing questions", async () => {
    it("creates onboarding questions from the course's template", async () => {
      const prisma = getClient();
      const course = await CourseFactory.create();
      const learner = await AccountFactory.create();
      const templates = await OnboardingQuestionTemplateFactory.createList([
        {
          course: { connect: { id: course.id } },
          position: 1,
        },
        {
          course: { connect: { id: course.id } },
          position: 2,
        },
      ]);

      await onboard(course.id, learner.id);

      const questions = await prisma.onboardingQuestion.findMany({
        orderBy: { position: "asc" },
        where: { courseId: course.id, learnerId: learner.id, origin: TEMPLATE },
      });

      expect(questions).toHaveLength(templates.length);
      expect(questions.map(({ description }) => description)).toEqual(
        templates.map(({ description }) => description),
      );
      expect(questions.map(({ question }) => question)).toEqual(
        templates.map(({ question }) => question),
      );
      expect(questions.map(({ position }) => position)).toEqual([1, 2]);
    });

    it("creates a final confirmation question", async () => {
      const prisma = getClient();
      const course = await CourseFactory.create();
      const learner = await AccountFactory.create();

      await onboard(course.id, learner.id);

      const lastQuestion = await prisma.onboardingQuestion.findFirst({
        orderBy: { position: "desc" },
        where: { courseId: course.id, learnerId: learner.id },
      });

      expect(lastQuestion?.origin).toBe(GENERATED);
      expect(lastQuestion?.position).toBe(1);
      expect(lastQuestion?.question).toBe(
        "Is this a good summary? Correct the record…",
      );
    });

    it("returns the first question and the question count", async () => {
      const course = await CourseFactory.create();
      const learner = await AccountFactory.create();
      const templateQuestions =
        await OnboardingQuestionTemplateFactory.createList([
          {
            course: { connect: { id: course.id } },
            position: 1,
          },
          {
            course: { connect: { id: course.id } },
            position: 2,
          },
        ]);

      const result = await onboard(course.id, learner.id);

      expect(result).toEqual({
        nextQuestion: {
          description: templateQuestions[0].description,
          id: expect.any(String),
          isGenerated: false,
          position: 1,
          question: templateQuestions[0].question,
        },
        questionCount: 3,
      });
    });

    it("marks the next question as generated when appropriate", async () => {
      const course = await CourseFactory.create();
      const learner = await AccountFactory.create();

      await OnboardingQuestionFactory.create({
        answer: "Done",
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
        position: 1,
      });

      const unanswered = await OnboardingQuestionFactory.use(
        "generated",
      ).create({
        course: { connect: { id: course.id } },
        learner: { connect: { id: learner.id } },
        position: 2,
      });

      const result = await onboard(course.id, learner.id);

      expect(result).toEqual({
        nextQuestion: {
          description: "",
          id: unanswered.id,
          isGenerated: true,
          position: 2,
          question: "",
        },
        questionCount: 2,
      });
    });
  });
});
