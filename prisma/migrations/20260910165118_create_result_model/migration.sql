/*
  Warnings:

  - You are about to drop the column `attempted` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `marksObtained` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `negativeMarks` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `percentile` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `positiveMarks` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `skipped` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `timeTaken` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuestions` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Result` table. All the data in the column will be lost.
  - You are about to alter the column `totalMarks` on the `Result` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `correctCount` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unattemptedCount` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrongCount` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Result_marksObtained_idx";

-- DropIndex
DROP INDEX "Result_percentage_idx";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "attempted",
DROP COLUMN "correct",
DROP COLUMN "incorrect",
DROP COLUMN "marksObtained",
DROP COLUMN "negativeMarks",
DROP COLUMN "percentage",
DROP COLUMN "percentile",
DROP COLUMN "positiveMarks",
DROP COLUMN "rank",
DROP COLUMN "skipped",
DROP COLUMN "timeTaken",
DROP COLUMN "totalQuestions",
DROP COLUMN "updatedAt",
ADD COLUMN     "correctCount" INTEGER NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unattemptedCount" INTEGER NOT NULL,
ADD COLUMN     "wrongCount" INTEGER NOT NULL,
ALTER COLUMN "totalMarks" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "Result_attemptId_idx" ON "Result"("attemptId");
