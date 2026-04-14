/*
  Warnings:

  - You are about to drop the column `payload` on the `quiz_attempts` table. All the data in the column will be lost.
  - Added the required column `quiz_id` to the `quiz_attempts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quiz_attempts" DROP COLUMN "payload",
ADD COLUMN     "quiz_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "quiz_attempt_answers" (
    "id" UUID NOT NULL,
    "attempt_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "selected_option_id" UUID NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_attempt_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quiz_attempt_answers_attempt_id_idx" ON "quiz_attempt_answers"("attempt_id");

-- CreateIndex
CREATE INDEX "quiz_attempt_answers_question_id_idx" ON "quiz_attempt_answers"("question_id");

-- CreateIndex
CREATE INDEX "quiz_attempt_answers_selected_option_id_idx" ON "quiz_attempt_answers"("selected_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempt_answers_attempt_id_question_id_key" ON "quiz_attempt_answers"("attempt_id", "question_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_quiz_id_idx" ON "quiz_attempts"("quiz_id");

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "quiz_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
