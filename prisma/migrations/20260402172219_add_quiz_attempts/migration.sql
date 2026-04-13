-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL,
    "learner_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "overall_feedback" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quiz_attempts_learner_id_idx" ON "quiz_attempts"("learner_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_lesson_id_idx" ON "quiz_attempts"("lesson_id");

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;