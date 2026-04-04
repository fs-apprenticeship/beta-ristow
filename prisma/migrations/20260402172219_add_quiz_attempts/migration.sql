-- CreateTable
CREATE TABLE "lesson_articles" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" UUID NOT NULL,
    "prompt" TEXT NOT NULL,
    "starter_code" TEXT,
    "solution" TEXT,
    "difficulty" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'python',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_submissions" (
    "id" UUID NOT NULL,
    "challenge_id" UUID NOT NULL,
    "user_code" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_submissions_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "lesson_articles_lesson_id_key" ON "lesson_articles"("lesson_id");

-- CreateIndex
CREATE INDEX "challenge_submissions_challenge_id_idx" ON "challenge_submissions"("challenge_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_learner_id_idx" ON "quiz_attempts"("learner_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_lesson_id_idx" ON "quiz_attempts"("lesson_id");

-- AddForeignKey
ALTER TABLE "lesson_articles" ADD CONSTRAINT "lesson_articles_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_submissions" ADD CONSTRAINT "challenge_submissions_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
