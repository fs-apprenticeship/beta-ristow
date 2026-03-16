-- DropIndex
DROP INDEX "courses_slug_idx";

-- DropIndex
DROP INDEX "lessons_course_id_idx";

-- DropIndex
DROP INDEX "lessons_course_id_slug_idx";

-- DropIndex
DROP INDEX "onboarding_question_templates_course_id_idx";

-- DropIndex
DROP INDEX "onboarding_questions_course_id_learner_id_idx";

-- CreateIndex
CREATE INDEX "onboarding_questions_learner_id_idx" ON "onboarding_questions"("learner_id");
