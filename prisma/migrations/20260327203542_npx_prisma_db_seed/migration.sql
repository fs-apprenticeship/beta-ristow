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

-- CreateIndex
CREATE INDEX "challenge_submissions_challenge_id_idx" ON "challenge_submissions"("challenge_id");

-- AddForeignKey
ALTER TABLE "challenge_submissions" ADD CONSTRAINT "challenge_submissions_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
