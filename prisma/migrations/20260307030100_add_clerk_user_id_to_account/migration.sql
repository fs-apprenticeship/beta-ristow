/*
  Warnings:

  - A unique constraint covering the columns `[clerk_user_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_user_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "clerk_user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_clerk_user_id_key" ON "accounts"("clerk_user_id");
