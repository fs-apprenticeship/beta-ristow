/*
  Warnings:

  - A unique constraint covering the columns `[course_id,position]` on the table `lessons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outcomes` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outcomes` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "outcomes" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "outcomes" TEXT NOT NULL,
ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lessons_course_id_position_key" ON "lessons"("course_id", "position");
