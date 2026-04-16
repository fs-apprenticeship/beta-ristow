-- AlterTable
ALTER TABLE "challenge_submissions" ADD COLUMN     "account_id" UUID;

-- CreateIndex
CREATE INDEX "challenge_submissions_account_id_idx" ON "challenge_submissions"("account_id");

-- AddForeignKey
ALTER TABLE "challenge_submissions" ADD CONSTRAINT "challenge_submissions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
