-- CreateTable
CREATE TABLE "onboarding_question_templates" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_question_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onboarding_question_templates_course_id_idx" ON "onboarding_question_templates"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_question_templates_course_id_position_key" ON "onboarding_question_templates"("course_id", "position");

-- AddForeignKey
ALTER TABLE "onboarding_question_templates" ADD CONSTRAINT "onboarding_question_templates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
