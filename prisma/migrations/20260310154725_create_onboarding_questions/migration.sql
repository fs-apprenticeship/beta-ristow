-- CreateEnum
CREATE TYPE "OnboardingQuestionOrigin" AS ENUM ('GENERATED', 'TEMPLATE');

-- CreateTable
CREATE TABLE "onboarding_questions" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "learner_id" UUID NOT NULL,
    "template_id" UUID,
    "position" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "description" TEXT NOT NULL,
    "origin" "OnboardingQuestionOrigin" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onboarding_questions_course_id_learner_id_idx" ON "onboarding_questions"("course_id", "learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_questions_course_id_learner_id_position_key" ON "onboarding_questions"("course_id", "learner_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_questions_template_id_learner_id_key" ON "onboarding_questions"("template_id", "learner_id");

-- AddForeignKey
ALTER TABLE "onboarding_questions" ADD CONSTRAINT "onboarding_questions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_questions" ADD CONSTRAINT "onboarding_questions_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_questions" ADD CONSTRAINT "onboarding_questions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "onboarding_question_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
