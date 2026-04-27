/*
  Warnings:

  - You are about to drop the column `isHidden` on the `challenge_test_cases` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `challenge_test_cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenge_test_cases" DROP COLUMN "isHidden",
ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
