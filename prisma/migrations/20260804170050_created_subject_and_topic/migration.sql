/*
  Warnings:

  - You are about to drop the column `description` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExamSubject" DROP CONSTRAINT "ExamSubject_examId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSubject" DROP CONSTRAINT "ExamSubject_subjectId_fkey";

-- DropIndex
DROP INDEX "Subject_slug_key";

-- DropIndex
DROP INDEX "Topic_subjectId_slug_key";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "description",
DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "description",
DROP COLUMN "slug";

-- DropTable
DROP TABLE "Exam";

-- DropTable
DROP TABLE "ExamSubject";

-- DropEnum
DROP TYPE "Difficulty";
