-- CreateTable
CREATE TABLE "challenge_test_cases" (
    "id" UUID NOT NULL,
    "challenge_id" UUID NOT NULL,
    "input" TEXT NOT NULL,
    "expected_output" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "challenge_test_cases_challenge_id_idx" ON "challenge_test_cases"("challenge_id");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_test_cases_challenge_id_position_key" ON "challenge_test_cases"("challenge_id", "position");

-- AddForeignKey
ALTER TABLE "challenge_test_cases" ADD CONSTRAINT "challenge_test_cases_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
