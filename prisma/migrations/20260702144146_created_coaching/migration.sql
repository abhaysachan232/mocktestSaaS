/*
  Warnings:

  - You are about to drop the column `docNumber` on the `Coaching` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `Coaching` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Coaching` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Coaching` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseCoaching` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailVerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamPaper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamPaperQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Coaching` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coachingName` to the `Coaching` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `Coaching` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Coaching` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_examPaperId_fkey";

-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "CourseCoaching" DROP CONSTRAINT "CourseCoaching_coachingId_fkey";

-- DropForeignKey
ALTER TABLE "CourseCoaching" DROP CONSTRAINT "CourseCoaching_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExamPaper" DROP CONSTRAINT "ExamPaper_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ExamPaperQuestion" DROP CONSTRAINT "ExamPaperQuestion_examPaperId_fkey";

-- DropForeignKey
ALTER TABLE "ExamPaperQuestion" DROP CONSTRAINT "ExamPaperQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_subjectId_fkey";

-- AlterTable
ALTER TABLE "Coaching" DROP COLUMN "docNumber",
DROP COLUMN "document",
DROP COLUMN "isActive",
DROP COLUMN "name",
ADD COLUMN     "coachingName" TEXT NOT NULL,
ADD COLUMN     "idNumber" TEXT NOT NULL,
ADD COLUMN     "idProof" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "coachingId" TEXT;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "Attempt";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseCoaching";

-- DropTable
DROP TABLE "EmailVerificationToken";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "ExamPaper";

-- DropTable
DROP TABLE "ExamPaperQuestion";

-- DropTable
DROP TABLE "PasswordResetToken";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "Topic";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateIndex
CREATE UNIQUE INDEX "Coaching_userId_key" ON "Coaching"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coachingId_fkey" FOREIGN KEY ("coachingId") REFERENCES "Coaching"("id") ON DELETE SET NULL ON UPDATE CASCADE;
