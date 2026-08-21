/*
  Warnings:

  - You are about to drop the column `duration` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `negativeMarking` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `negativeMarks` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `totalMarks` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuestions` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the `ExamQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExamQuestion" DROP CONSTRAINT "ExamQuestion_examId_fkey";

-- DropForeignKey
ALTER TABLE "ExamQuestion" DROP CONSTRAINT "ExamQuestion_questionId_fkey";

-- DropIndex
DROP INDEX "Exam_parentId_idx";

-- DropIndex
DROP INDEX "Exam_status_idx";

-- DropIndex
DROP INDEX "Exam_type_idx";

-- DropIndex
DROP INDEX "Exam_userId_slug_key";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "duration",
DROP COLUMN "negativeMarking",
DROP COLUMN "negativeMarks",
DROP COLUMN "parentId",
DROP COLUMN "status",
DROP COLUMN "totalMarks",
DROP COLUMN "totalQuestions",
DROP COLUMN "type",
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "ExamQuestion";

-- DropEnum
DROP TYPE "ExamStatus";

-- DropEnum
DROP TYPE "ExamType";

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
